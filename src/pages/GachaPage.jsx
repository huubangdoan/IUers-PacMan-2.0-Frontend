import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  getSkinCatalog, getSkinInventory, rollGacha, selectOwnedSkin,
} from '../services/gachaApi';
import './GachaPage.css';

// Use the existing Pac-Man sprite assets; no duplicated images in this patch.
const spriteFiles = import.meta.glob('../assets/Gacha Skin/**/right/1.webp', {
  eager: true, query: '?url', import: 'default',
});
const spriteEntries = Object.entries(spriteFiles).map(([path, url]) => {
  const parts = path.split('/');
  return { category: parts.at(-4), folder: parts.at(-3), url };
});
const normalize = (value) => String(value ?? '')
  .toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
  .replace(/pac\s*man/g, '').replace(/[^a-z0-9]/g, '');
const rarityFromFolder = (folder) => folder?.replace(/\s*skin$/i, '').toLowerCase();
const imageFor = (skin) => {
  const name = normalize(skin.assetKey || skin.name || skin.skinName || skin.id);
  const rarity = normalize(skin.rarity);
  return spriteEntries.find((item) => normalize(item.folder) === name &&
    (!rarity || normalize(rarityFromFolder(item.category)) === rarity))?.url ||
    spriteEntries.find((item) => normalize(item.folder) === name)?.url || null;
};

// Catalog preview is cosmetic only. Do NOT use these values to roll or credit coins.
const previewCatalog = spriteEntries.map(({ folder, category }, index) => ({
  id: `preview-${index}`, name: folder, rarity: rarityFromFolder(category),
  assetKey: folder, previewOnly: true,
}));

function unwrapArray(payload, keys) {
  if (Array.isArray(payload)) return payload;
  for (const key of keys) if (Array.isArray(payload?.[key])) return payload[key];
  if (Array.isArray(payload?.data)) return payload.data;
  for (const key of keys) if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  return null;
}
function parseInventory(payload) {
  const data = payload?.data && !Array.isArray(payload.data) ? payload.data : payload;
  const raw = unwrapArray(data, ['skins', 'ownedSkins', 'inventory']);
  if (!data || !raw) throw new Error('Inventory response không đúng định dạng. Cần thống nhất API contract với Backend.');
  return {
    balance: data.balance ?? data.coinBalance ?? data.coins,
    selectedSkinId: data.selectedSkinId ?? data.selectedSkin?.id ?? null,
    ownedIds: new Set(raw.map((skin) => String(typeof skin === 'object'
      ? skin.skinId ?? skin.id ?? skin.skin?.id : skin)).filter((id) => id !== 'undefined')),
  };
}
function parseCatalog(payload) {
  const rows = unwrapArray(payload, ['skins', 'catalog', 'items']);
  if (!rows) throw new Error('Catalog response không đúng định dạng. Cần thống nhất API contract với Backend.');
  return rows;
}
function safeNumber(value) {
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}
function randomKey() {
  return typeof crypto !== 'undefined' && crypto.randomUUID
    ? crypto.randomUUID()
    : `gacha-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function GachaPage({ setCurrentPage }) {
  const [catalog, setCatalog] = useState([]);
  const [inventory, setInventory] = useState(null);
  const [busy, setBusy] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [result, setResult] = useState(null);
  const [tab, setTab] = useState('gacha');
  const pendingKey = useRef(null);
  const mounted = useRef(true);
  const [loaded, setLoaded] = useState(false);

  const refresh = useCallback(async () => {
    setBusy('refresh'); setError('');
    try {
      const [cat, inv] = await Promise.all([getSkinCatalog(), getSkinInventory()]);
      const normalizedCatalog = parseCatalog(cat);
      const normalizedInventory = parseInventory(inv);
      if (!mounted.current) return;
      setCatalog(normalizedCatalog);
      setInventory(normalizedInventory);
      setLoaded(true);
      setNotice('Đã đồng bộ dữ liệu từ Backend.');
    } catch (err) {
      if (!mounted.current) return;
      setLoaded(false);
      setError(err.message || 'Không thể kết nối Backend.');
    } finally {
      if (mounted.current) setBusy('');
    }
  }, []);

  useEffect(() => {
    mounted.current = true;
    refresh();
    return () => { mounted.current = false; };
  }, [refresh]);

  const displayCatalog = useMemo(() => loaded ? catalog : previewCatalog, [loaded, catalog]);
  const rarityCounts = useMemo(() => ({
    common: displayCatalog.filter(s => String(s.rarity).toLowerCase() === 'common').length,
    rare: displayCatalog.filter(s => String(s.rarity).toLowerCase() === 'rare').length,
    epic: displayCatalog.filter(s => String(s.rarity).toLowerCase() === 'epic').length,
  }), [displayCatalog]);
  const money = safeNumber(inventory?.balance);

  const handleRoll = async (count) => {
    if (!loaded || busy || !inventory) return;
    // Persist across retry of the *same* operation, including network errors.
    const key = pendingKey.current?.count === count ? pendingKey.current.key : randomKey();
    pendingKey.current = { count, key };
    setBusy(`roll-${count}`); setError(''); setResult(null);
    try {
      const reply = await rollGacha(count, key);
      if (!mounted.current) return;
      const data = reply?.data ?? reply;
      // Treat server roll results as read-only: no client-side randomization.
      setResult(data);
      pendingKey.current = null;
      // Re-query authoritative state (works even if roll response fields vary).
      try {
        const fresh = await getSkinInventory();
        if (mounted.current) setInventory(parseInventory(fresh));
      } catch {
        if (mounted.current) setNotice('Roll thành công, nhưng chưa làm mới được ví; hãy chọn Refresh.');
      }
    } catch (err) {
      if (mounted.current) setError(`Roll chưa được xác nhận: ${err.message}. Nhấn cùng gói để retry với cùng idempotencyKey.`);
    } finally {
      if (mounted.current) setBusy('');
    }
  };

  const handleEquip = async (skinId) => {
    if (!loaded || busy) return;
    setBusy(`equip-${skinId}`); setError('');
    try {
      await selectOwnedSkin(skinId);
      const fresh = await getSkinInventory();
      if (mounted.current) {
        setInventory(parseInventory(fresh));
        setNotice('Đã đồng bộ skin được chọn từ Backend.');
      }
    } catch (err) {
      if (mounted.current) setError(`Không thể chọn skin: ${err.message}`);
    } finally {
      if (mounted.current) setBusy('');
    }
  };

  const results = result ? unwrapArray(result, ['results', 'rewards', 'skins', 'items']) : null;
  return (
    <section className="gacha-page">
      <div className="gacha-shell">
        <header className="gacha-header">
          <div><p className="gacha-eyebrow">IUers' PAC-MAN / COSMETICS</p><h1>GACHA <span>& SKINS</span></h1>
            <p>Unlock new looks. Your skin never changes gameplay stats.</p></div>
          <div className="gacha-top-actions"><div className="gacha-wallet">🪙 <strong>{money === null ? '—' : money.toLocaleString('en-US')}</strong><small>COINS</small></div>
            <button type="button" className="gacha-ghost-btn" onClick={() => setCurrentPage('game-menu')}>← Back to Menu</button></div>
        </header>

        {!loaded && <div className="gacha-offline" role="status"><strong>Preview only — no game transactions.</strong> Catalog images come from local assets. Coin balance, ownership, roll and equip are disabled until Backend is connected.</div>}
        {error && <div className="gacha-error" role="alert">{error}</div>}
        {notice && loaded && <div className="gacha-notice" role="status">{notice}</div>}
        <div className="gacha-toolbar"><div className="gacha-tabs">
          <button type="button" className={tab === 'gacha' ? 'active' : ''} onClick={() => setTab('gacha')}>Gacha</button>
          <button type="button" className={tab === 'collection' ? 'active' : ''} onClick={() => setTab('collection')}>My Collection</button>
        </div><button type="button" onClick={refresh} disabled={!!busy}>↻ Refresh from server</button></div>

        {tab === 'gacha' && <div className="gacha-feature">
          <div className="gacha-feature-copy"><p className="gacha-eyebrow">THE MULTIVERSE COLLECTION</p><h2>Every roll. A new possibility.</h2>
            <p>Server-controlled drops: <b>Common 80%</b> · <b>Rare 18%</b> · <b>Epic 2%</b></p>
            <p className="gacha-rule">10 pulls: guaranteed Rare+ · 100 pulls: guaranteed Epic · Duplicate refund: 800 coins (server rules).</p>
          </div>
          <div className="gacha-roll-buttons">
            {[1,10,100].map(count => {
              const cost = 1600 * count;
              return <button type="button" key={count} disabled={!loaded || !!busy || money === null || money < cost}
                onClick={() => handleRoll(count)} title={!loaded ? 'Connect Backend first' : ''}>
                <strong>{busy === `roll-${count}` ? 'Rolling…' : `ROLL ×${count}`}</strong><span>🪙 {cost.toLocaleString('en-US')}</span>
              </button>;
            })}
          </div>
          {result && <div className="gacha-result" role="status"><h3>Server roll result</h3>
            <p>Balance: {String(result.balance ?? result.coinBalance ?? 'See wallet after refresh')}</p>
            {results ? <ul>{results.map((item,i) => <li key={i}>
              {String(item.name ?? item.skinName ?? item.skinId ?? item.id ?? 'Skin')} — {String(item.rarity ?? '')}
              {item.duplicate ? ' (duplicate)' : ''}{item.refund ? ` +${item.refund} refund` : ''}
            </li>)}</ul> : <pre>{JSON.stringify(result, null, 2)}</pre>}
          </div>}
        </div>}

        <div className="gacha-section-heading"><div><h2>{tab === 'collection' ? 'MY COLLECTION' : 'SKIN CATALOG'}</h2><p>{tab === 'collection' ? 'Equip any skin you own.' : 'Discover every available look.'}</p></div>
          <span>{rarityCounts.common} Common · {rarityCounts.rare} Rare · {rarityCounts.epic} Epic</span></div>
        <div className="gacha-grid">
          {displayCatalog.filter(skin => tab !== 'collection' || (loaded && inventory?.ownedIds.has(String(skin.id)))).map((skin, index) => {
            const owned = loaded && inventory?.ownedIds.has(String(skin.id));
            const selected = loaded && String(inventory?.selectedSkinId) === String(skin.id);
            const rarity = String(skin.rarity || 'common').toLowerCase();
            return <article className={`gacha-skin-card rarity-${rarity}`} key={`${skin.id}-${index}`}>
              <div className="gacha-card-top"><span className="gacha-rarity">{rarity}</span>{selected && <span className="gacha-equipped">EQUIPPED</span>}</div>
              <div className="gacha-sprite-wrap">{imageFor(skin) ? <img src={imageFor(skin)} alt={skin.name || String(skin.id)} /> : <span aria-hidden="true">◉</span>}</div>
              <h3>{skin.name || skin.skinName || String(skin.id)}</h3>
              <p className="gacha-card-caption">{!loaded ? 'Preview only' : owned ? 'Owned' : 'Not owned'}</p>
              {tab === 'collection' && <button type="button" disabled={!owned || selected || !!busy} onClick={() => handleEquip(skin.id)}>{selected ? 'Selected' : 'Equip skin'}</button>}
            </article>;
          })}
        </div>
        {tab === 'collection' && (!loaded || !displayCatalog.some(s => inventory?.ownedIds.has(String(s.id)))) &&
          <p className="gacha-empty">{loaded ? 'No owned skins returned by the server.' : 'Connect Backend to view your inventory.'}</p>}
      </div>
    </section>
  );
}

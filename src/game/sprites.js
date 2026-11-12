const files = import.meta.glob(
  '../assets/Default Skin/**/*.{png,jpg,jpeg,gif,webp}',
  { eager: true, import: 'default' }
);

function load(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

export async function loadSprites() {
  const sprites = {};
  await Promise.all(
    Object.entries(files).map(async ([path, url]) => {
      const key = path.split('/').slice(-2).join('/');
      sprites[key] = await load(url);
    })
  );
  return sprites;
}
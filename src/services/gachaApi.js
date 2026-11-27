import api from './api';

// api.js already adds the JWT and returns response.data.
export const getSkinCatalog = () => api.get('/cosmetics/catalog');
export const getSkinInventory = () => api.get('/me/inventory');
export const rollGacha = (count, idempotencyKey) =>
  api.post('/gacha/roll', { count, idempotencyKey });
export const selectOwnedSkin = (skinId) =>
  api.put('/me/skin', { skinId });

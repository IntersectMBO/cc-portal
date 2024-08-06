export const TOP_BANER = "seen_top_banner";

export function getItemFromSessionStorage(key: string) {
  const item = window.sessionStorage.getItem(key);
  return item ? JSON.parse(item) : null;
}

export function setItemToSessionStorage(key: string, data: any) {
  window.sessionStorage.setItem(key, JSON.stringify(data));
}

export function removeItemFromSessionStorage(key: string) {
  window.sessionStorage.removeItem(key);
}

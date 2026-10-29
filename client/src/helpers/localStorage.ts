export function saveValue(key: string, value: string) {
  localStorage.setItem(key, value);
}

export function readValue(key: string) {
  return localStorage.getItem(key);
}

export function removeValue(key: string) {
  localStorage.removeItem(key);
}
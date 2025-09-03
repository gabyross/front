export const DEV_AUTH_KEY = 'devAuth:loggedIn';

export function isDevAuthed() {
  if (typeof window === 'undefined') return false;
  return window.localStorage.getItem(DEV_AUTH_KEY) === '1';
}

export function setDevAuthed(value) {
  if (typeof window === 'undefined') return;
  window.localStorage.setItem(DEV_AUTH_KEY, value ? '1' : '0');
}

export function clearDevAuth() {
  if (typeof window === 'undefined') return;
  window.localStorage.removeItem(DEV_AUTH_KEY);
}

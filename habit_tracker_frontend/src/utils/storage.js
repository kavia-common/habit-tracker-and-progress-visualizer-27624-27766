function hasLocalStorage() {
  try {
    const testKey = '__ls_test__';
    window.localStorage.setItem(testKey, '1');
    window.localStorage.removeItem(testKey);
    return true;
  } catch {
    return false;
  }
}

// PUBLIC_INTERFACE
export function safeLoad(key) {
  if (!hasLocalStorage()) return null;
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

// PUBLIC_INTERFACE
export function safeSave(key, value) {
  if (!hasLocalStorage()) return false;
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

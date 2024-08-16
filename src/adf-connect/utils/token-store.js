const tokenStore = {
  get: (key) => window.localStorage.getItem(`adf.${key}`),
  set: (key, item) => window.localStorage.setItem(`adf.${key}`, item),
  clear: (key) => window.localStorage.removeItem(`adf.${key}`),
  clearAll: () => window.localStorage.clear(),
};

export default tokenStore;

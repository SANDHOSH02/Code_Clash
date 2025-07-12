export const saveCode = (key, code) => {
  try {
    localStorage.setItem(key, code);
  } catch (err) {
    console.error('Error saving to localStorage:', err);
  }
};

export const loadCode = (key) => {
  try {
    return localStorage.getItem(key) || '';
  } catch (err) {
    console.error('Error loading from localStorage:', err);
    return '';
  }
};
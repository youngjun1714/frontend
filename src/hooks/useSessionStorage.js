import { useState, useEffect } from 'react';

export default function useSessionStorage(key, initialValue) {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    const storedValue = sessionStorage.getItem(key);
    if (storedValue !== null) {
      setValue(storedValue);
    }
  }, []);

  const setStoredValue = (newValue) => {
    setValue(newValue);
  };

  return [value, setStoredValue];
}

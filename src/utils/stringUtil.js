export const capitalize = (str) => {
  if (typeof str !== 'string' || str.length === 0) {
    return str;
  }
  return str[0].toUpperCase() + str.slice(1).toLowerCase();
};

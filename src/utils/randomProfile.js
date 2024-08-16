export default function getRandomColor(username) {
  const RANDOM_COLORS = [
    '#00B5B0',
    '#A04EE1',
    '#B90828',
    '#5EA405',
    '#C4B000',
    '#FF03C8',
    '#04DB00',
    '#00A3FF',
    '#0007B5',
    '#FF5C00',
  ];

  if (!username) {
    return RANDOM_COLORS[0];
  }

  let hashCode = 0;
  for (let i = 0; i < username.length; i++) {
    hashCode = username.charCodeAt(i) + ((hashCode << 5) - hashCode);
  }

  const random = (Math.abs(hashCode) % 10) + 1;
  return RANDOM_COLORS[random];
}

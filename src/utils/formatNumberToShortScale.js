export default function formatNumberToShortScale(number) {
  if (!number) return 0;

  if (number < 1000) {
    return number.toString();
  }

  if (number >= 1_000_000) {
    const formattedNumber =
      (number / 1_000_000).toLocaleString('en', {
        style: 'decimal',
        maximumFractionDigits: 1,
      }) + 'm';
    return formattedNumber;
  } else {
    const formattedNumber =
      (number / 1000).toLocaleString('en', {
        style: 'decimal',
        maximumFractionDigits: 1,
      }) + 'k';
    return formattedNumber;
  }
}

export default function isExpiredPopup(key) {
  const ONE_WEEK_MILLISECONDS = 7 * 24 * 60 * 60 * 1000;
  const timestamp = sessionStorage.getItem(key);

  return Date.now() - timestamp <= ONE_WEEK_MILLISECONDS;
}

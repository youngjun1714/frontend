export default function MobileFollowIcon({ size }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size === 'sm' ? '12' : '16'}
      height={size === 'sm' ? '12' : '16'}
      viewBox="0 0 16 16"
      fill="none"
    >
      <path
        d="M8 11.5L8 4.5M11.5 8L4.5 8"
        stroke="#1B1E24"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <path
        d="M15 8C15 11.866 11.866 15 8 15C4.13401 15 1 11.866 1 8C1 4.13401 4.13401 1 8 1C11.866 1 15 4.13401 15 8Z"
        stroke="#1B1E24"
        strokeWidth="1.5"
      />
    </svg>
  );
}

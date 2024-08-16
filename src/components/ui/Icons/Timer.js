const Timer = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle
      cx="12"
      cy="13.4792"
      r="7"
      stroke={color || 'var(--artiside-neutral1)'}
      strokeWidth="2"
    />
    <path
      d="M14.625 3.27087H9.375"
      stroke={color || 'var(--artiside-neutral1)'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12 12.8959V9.97925"
      stroke={color || 'var(--artiside-neutral1)'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Timer;

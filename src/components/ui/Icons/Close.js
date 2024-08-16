const Close = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 18L18 6"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M18 18L6 6"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Close;

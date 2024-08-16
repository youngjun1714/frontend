const PlusCircle = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 16L12 8M16 12L8 12"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M20 12C20 16.4183 16.4183 20 12 20C7.58172 20 4 16.4183 4 12C4 7.58172 7.58172 4 12 4C16.4183 4 20 7.58172 20 12Z"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
    />
  </svg>
);

export default PlusCircle;

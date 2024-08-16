const MobileBackChevron = ({ isWhite }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M15 5L8 12L15 19"
      stroke={isWhite ? '#FFFFFF' : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default MobileBackChevron;

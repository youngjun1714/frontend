const Copy = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M6 16H5C4.44772 16 4 15.5523 4 15V5C4 4.44772 4.44772 4 5 4H15C15.5523 4 16 4.44772 16 5V6M9 20H19C19.5523 20 20 19.5523 20 19V9C20 8.44772 19.5523 8 19 8H9C8.44772 8 8 8.44772 8 9V19C8 19.5523 8.44772 20 9 20Z"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinejoin="round"
    />
  </svg>
);

export default Copy;

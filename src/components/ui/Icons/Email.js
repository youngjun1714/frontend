const Email = ({ color, dimension }) => (
  <svg
    style={{ width: dimension, height: dimension }}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 6L12.0034 11L19.9985 6"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M4.40012 18C3.62685 18 3 17.4826 3 16.8444V6.15556C3 5.51736 3.62685 5 4.40012 5H19.5999C20.3731 5 21 5.51736 21 6.15556V16.8444C21 17.4826 20.3731 18 19.5999 18H4.40012Z"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Email;

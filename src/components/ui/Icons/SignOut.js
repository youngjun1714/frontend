const SignOut = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M20 12C20 12 13.8195 12 10.5 12M18 15L21 12L18 9M13 7L13 6C13 4.89543 12.1046 4 11 4L6 4C4.89543 4 4 4.89543 4 6L4 18C4 19.1046 4.89543 20 6 20L11 20C12.1046 20 13 19.1046 13 18L13 17"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default SignOut;

const Image = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18Z"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M4 15.6667H10.9583C11.244 15.6667 11.516 15.5445 11.7058 15.331L14.8081 11.8408C15.2059 11.3933 15.9052 11.3933 16.303 11.8408L20 16"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinejoin="round"
    />
    <path
      d="M7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5Z"
      fill={color ? color : '#1B1E24'}
    />
  </svg>
);

export default Image;

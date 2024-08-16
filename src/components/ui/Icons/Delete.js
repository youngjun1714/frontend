const Delete = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#clip0_1453_35698)">
      <path
        d="M6.37037 7.25928V18C6.37037 19.1046 7.2658 20 8.37037 20H15.6296C16.7342 20 17.6296 19.1046 17.6296 18V7.25928M4 7.25928H20"
        stroke={color ? color : '#1B1E24'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M8.44446 4H15.5556"
        stroke={color ? color : '#1B1E24'}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M10.2222 11.4074V15.8519"
        stroke={color ? color : '#1B1E24'}
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M13.7778 11.4074V15.8519"
        stroke={color ? color : '#1B1E24'}
        strokeWidth="2"
        strokeLinecap="round"
      />
    </g>
    <defs>
      <clipPath id="clip0_1453_35698">
        <rect width="24" height="24" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

export default Delete;

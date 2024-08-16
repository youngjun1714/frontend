const Dots = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      x="3"
      y="10"
      width="4"
      height="4"
      rx="2"
      fill={color ? color : '#1B1E24'}
    />
    <rect
      x="10"
      y="10"
      width="4"
      height="4"
      rx="2"
      fill={color ? color : '#1B1E24'}
    />
    <rect
      x="17"
      y="10"
      width="4"
      height="4"
      rx="2"
      fill={color ? color : '#1B1E24'}
    />
  </svg>
);

export default Dots;

const FaceHappy = ({ color }) => (
  <svg
    style={{ width: '100%', height: '100%' }}
    width="200"
    height="200"
    viewBox="0 0 200 200"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect
      width="200"
      height="200"
      rx="100"
      fill={color ? color : 'black'}
      fillOpacity="0.1"
    />
    <path
      d="M123.444 123.444C117.182 129.492 108.689 132.889 99.8333 132.889C90.9774 132.889 82.4842 129.492 76.2222 123.444"
      stroke={color ? color : 'black'}
      strokeOpacity="0.2"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M78.5833 78.583H78.6666"
      stroke={color ? color : 'black'}
      strokeOpacity="0.2"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M121.084 78.583H121.167"
      stroke={color ? color : 'black'}
      strokeOpacity="0.2"
      strokeWidth="10"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default FaceHappy;

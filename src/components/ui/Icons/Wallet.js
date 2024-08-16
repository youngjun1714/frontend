const Wallet = ({ dimension, color }) => (
  <svg
    style={{ width: dimension, height: dimension }}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M4 7.86204V17.4482C4 18.5528 4.89543 19.4482 6 19.4482H18C19.1046 19.4482 20 18.5528 20 17.4482V9.86204C20 8.75747 19.1046 7.86204 18 7.86204H15.5862M4 7.86204V6.5517C4 5.44713 4.89543 4.5517 6 4.5517H13.5862C14.6908 4.5517 15.5862 5.44713 15.5862 6.5517V7.86204M4 7.86204H15.5862"
      stroke={color || '#1B1E24'}
      strokeWidth="2"
    />
    <path
      d="M14.4828 13.6552L16.6897 13.6552"
      stroke={color || '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Wallet;

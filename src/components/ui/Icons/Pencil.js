const Pencil = ({ dimension, color }) => (
  <svg
    style={{ width: dimension, height: dimension }}
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M16.8253 11.055L8.05187 19.8284H4.00262L4 15.7766L12.7734 7.00317L16.8253 11.055Z"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M12.7734 7.00319L14.2842 5.49237C14.9407 4.83588 16.0051 4.83588 16.6616 5.49237L18.3361 7.16688C18.9926 7.82337 18.9926 8.88775 18.3361 9.54424L16.8252 11.0551V11.0551"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Pencil;

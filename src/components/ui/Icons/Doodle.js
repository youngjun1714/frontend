const Doodle = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M3 13.5794C3 13.5794 13.4837 1.96212 15.7652 4.43353C18.0467 6.90493 7.55581 16.1455 9.47834 17.9541C11.4009 19.7626 16.9959 11.5719 19.0578 12.4109C21.1197 13.2499 16.1153 18.1723 17.4056 18.9998C18.6959 19.8273 20.5657 17.5275 20.5657 17.5275"
      stroke={color ? color : '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Doodle;

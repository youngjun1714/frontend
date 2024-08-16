const QuestionCircle = ({ color = '#ffffff' }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12 15.76V15.75"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M9.75 10.5C9.75 10.055 9.88196 9.61998 10.1292 9.24997C10.3764 8.87996 10.7278 8.59157 11.139 8.42127C11.5501 8.25097 12.0025 8.20642 12.439 8.29323C12.8754 8.38005 13.2763 8.59434 13.591 8.90901C13.9057 9.22368 14.1199 9.62459 14.2068 10.061C14.2936 10.4975 14.249 10.9499 14.0787 11.361C13.9084 11.7722 13.62 12.1236 13.25 12.3708C12.88 12.618 12.445 12.75 12 12.75L12 13.25"
      stroke={color}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M4.75 12C4.75 16.0041 7.99594 19.25 12 19.25C16.0041 19.25 19.25 16.0041 19.25 12C19.25 7.99594 16.0041 4.75 12 4.75C7.99594 4.75 4.75 7.99594 4.75 12Z"
      stroke={color}
      strokeWidth="1.5"
    />
  </svg>
);

export default QuestionCircle;

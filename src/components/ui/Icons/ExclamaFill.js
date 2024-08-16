const ExclamaFill = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M12.384 3C7.44477 3 3.42627 7.0374 3.42627 12C3.42627 16.9626 7.46367 21 12.4263 21C17.3889 21 21.4263 16.9626 21.4263 12C21.4263 7.0374 17.37 3 12.384 3ZM13.3263 16.5H11.5263V14.7H13.3263V16.5ZM13.3263 12.9H11.5263V7.5H13.3263V12.9Z"
      fill={color || '#5F44FF'}
    />
  </svg>
);

export default ExclamaFill;

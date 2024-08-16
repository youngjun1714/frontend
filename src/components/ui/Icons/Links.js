const Links = ({ color }) => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M13.6736 18.3403C12.6109 19.403 11.1696 20 9.66667 20C8.16377 20 6.72243 19.403 5.65973 18.3403C4.59702 17.2776 4 15.8362 4 14.3334C4 12.8305 4.59702 11.3891 5.65973 10.3264"
      stroke={color || '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M10.3264 5.65971C11.3891 4.597 12.8304 3.99998 14.3333 3.99998C15.8362 3.99998 17.2776 4.597 18.3403 5.65971C19.403 6.72241 20 8.16375 20 9.66665C20 11.1695 19.403 12.6109 18.3403 13.6736"
      stroke={color || '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M14.3334 9.66669L9.66669 14.3334"
      stroke={color || '#1B1E24'}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

export default Links;

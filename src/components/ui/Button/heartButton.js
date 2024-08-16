function HeartButton(props) {
  const { liked } = props;

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill={liked ? 'var(--secondary-color)' : 'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M8 4.53681C6.67549 3.22905 4.24588 2.82922 2.92137 4.13698C1.59686 5.44473 1.79279 7.20481 2.92138 8.73698C4.04996 10.2692 5.82006 11.6456 8 13.3335C10.1799 11.6456 11.95 10.2692 13.0786 8.73698C14.2072 7.20481 14.4031 5.44473 13.0786 4.13698C11.7541 2.82922 9.32451 3.22905 8 4.53681Z"
        stroke={liked ? 'none' : '#999EA3'}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export default HeartButton;

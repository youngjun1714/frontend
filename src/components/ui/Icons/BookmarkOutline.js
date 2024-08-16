const BookmarkOutline = (props) => {
  const { fill, color } = props;

  return (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill={fill ? fill : 'none'}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 20V5C6 4.44772 6.44772 4 7 4H17C17.5523 4 18 4.44772 18 5V20L12 17L6 20Z"
        stroke={color ? color : '#1B1E24'}
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default BookmarkOutline;

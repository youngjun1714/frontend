export default function MobileHeartIcon(props) {
  const { isLiked } = props;
  return (
    <svg
      style={{ transition: 'fill 300ms' }}
      width="14"
      height="13"
      viewBox="0 0 14 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        id="Vector"
        d="M7 2.70331C5.67549 1.39555 3.24588 0.995725 1.92137 2.30348C0.59686 3.61124 0.792793 5.37131 1.92138 6.90348C3.04996 8.43566 4.82006 9.81213 7 11.5C9.17994 9.81213 10.95 8.43566 12.0786 6.90348C13.2072 5.37131 13.4031 3.61124 12.0786 2.30348C10.7541 0.995725 8.32451 1.39555 7 2.70331Z"
        stroke={isLiked ? 'var(--secondary-color)' : '#999EA3'}
        fill={isLiked ? 'var(--secondary-color)' : ''}
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

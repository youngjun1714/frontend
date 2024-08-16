export default function MobileSendIcon({ isWrite }) {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <ellipse
        cx="15.6086"
        cy="16"
        rx="15.6086"
        ry="16"
        fill={isWrite ? '#00B5B0' : 'none'}
      />
      <path
        d="M9.66973 10.5322L23.6849 16.2788L9.66973 22.0254L12.4728 16.2788L9.66973 10.5322Z"
        stroke={isWrite ? 'white' : 'var(--artiside-neutral5)'}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

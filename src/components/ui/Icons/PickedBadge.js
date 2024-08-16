const PickedBadge = () => (
  <svg
    width="60"
    height="60"
    viewBox="0 0 60 60"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_d_1054_41637)">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 50C41.0457 50 50 41.0457 50 30C50 18.9543 41.0457 10 30 10C18.9543 10 10 18.9543 10 30C10 41.0457 18.9543 50 30 50ZM41.0575 26.0607C41.6433 25.4749 41.6433 24.5251 41.0575 23.9393C40.4717 23.3536 39.522 23.3536 38.9362 23.9393L27.4396 35.436L21.7113 30.3107C21.094 29.7583 20.1457 29.811 19.5933 30.4284C19.0409 31.0458 19.0936 31.994 19.7109 32.5464L26.4967 38.6179C27.0899 39.1487 27.9946 39.1236 28.5575 38.5607L41.0575 26.0607Z"
        fill="white"
      />
    </g>
    <defs>
      <filter
        id="filter0_d_1054_41637"
        x="0"
        y="0"
        width="60"
        height="60"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset />
        <feGaussianBlur stdDeviation="5" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow_1054_41637"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_dropShadow_1054_41637"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

export default PickedBadge;

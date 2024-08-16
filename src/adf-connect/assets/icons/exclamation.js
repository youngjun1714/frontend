const ExclamationIcon = () => (
  <svg
    width="50"
    height="50"
    viewBox="0 0 50 50"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_b_293_37157)">
      <circle cx="25" cy="25" r="24" fill="url(#paint0_radial_293_37157)" />
      <circle cx="25" cy="25" r="24" stroke="url(#paint1_linear_293_37157)" />
      <circle
        cx="25"
        cy="25"
        r="24"
        stroke="url(#paint2_linear_293_37157)"
        strokeOpacity="0.2"
      />
    </g>
    <path
      d="M25 33.8282C25 33.8355 25 33.847 25 33.847"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M25 15.8467V25.8467"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_b_293_37157"
        x="-9.5"
        y="-9.5"
        width="69"
        height="69"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="effect1_backgroundBlur_293_37157"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_293_37157"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_293_37157"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(6.9645 5.26035) rotate(49.2142) scale(57.3932)"
      >
        <stop stopColor="#DCDCDC" stopOpacity="0.4" />
        <stop offset="1" stopColor="#606060" stopOpacity="0.09" />
      </radialGradient>
      <linearGradient
        id="paint1_linear_293_37157"
        x1="5.68639"
        y1="0.999999"
        x2="43.1775"
        y2="48.716"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0.6" />
        <stop offset="1" stopColor="#727272" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_293_37157"
        x1="-1.55621"
        y1="24.858"
        x2="51.6982"
        y2="24.858"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E3E8EA" />
        <stop offset="1" stopColor="#E2E2E2" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default ExclamationIcon;

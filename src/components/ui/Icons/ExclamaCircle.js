const ExclamaCircle = () => (
  <svg
    width="45"
    height="46"
    viewBox="0 0 45 46"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g filter="url(#filter0_b_2195_5426)">
      <circle cx="22.5" cy="23" r="22" fill="url(#paint0_radial_2195_5426)" />
      <circle cx="22.5" cy="23" r="22" stroke="url(#paint1_linear_2195_5426)" />
      <circle
        cx="22.5"
        cy="23"
        r="22"
        stroke="url(#paint2_linear_2195_5426)"
        strokeOpacity="0.2"
      />
    </g>
    <path
      d="M22.5 31.0938C22.5 31.1011 22.5 31.1125 22.5 31.1125"
      stroke="white"
      strokeWidth="5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M22.5 14.6104V23.777"
      stroke="white"
      strokeWidth="4"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="filter0_b_2195_5426"
        x="-10"
        y="-9.5"
        width="65"
        height="65"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feGaussianBlur in="BackgroundImageFix" stdDeviation="5" />
        <feComposite
          in2="SourceAlpha"
          operator="in"
          result="effect1_backgroundBlur_2195_5426"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect1_backgroundBlur_2195_5426"
          result="shape"
        />
      </filter>
      <radialGradient
        id="paint0_radial_2195_5426"
        cx="0"
        cy="0"
        r="1"
        gradientUnits="userSpaceOnUse"
        gradientTransform="translate(5.96746 4.90532) rotate(49.2142) scale(52.6104)"
      >
        <stop stopColor="#DCDCDC" stopOpacity="0.4" />
        <stop offset="1" stopColor="#606060" stopOpacity="0.09" />
      </radialGradient>
      <linearGradient
        id="paint1_linear_2195_5426"
        x1="4.79586"
        y1="0.999999"
        x2="39.1627"
        y2="44.7396"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="white" stopOpacity="0.6" />
        <stop offset="1" stopColor="#727272" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="paint2_linear_2195_5426"
        x1="-1.8432"
        y1="22.8698"
        x2="46.9734"
        y2="22.8698"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopColor="#E3E8EA" />
        <stop offset="1" stopColor="#E2E2E2" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
);

export default ExclamaCircle;

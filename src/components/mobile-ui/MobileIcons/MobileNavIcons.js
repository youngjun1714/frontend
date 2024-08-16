export default function MobileNavIcons({ shape, active }) {
  if (shape === 'creation') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill={active ? 'var(--primary-color)' : 'none'}
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="image">
          <g id="Group 38417">
            <path
              id="Vector"
              d="M4 18V6C4 4.89543 4.89543 4 6 4H18C19.1046 4 20 4.89543 20 6V18C20 19.1046 19.1046 20 18 20H6C4.89543 20 4 19.1046 4 18Z"
              stroke={active ? 'var(--primary-color)' : '#1B1E24'}
              strokeWidth="1.5"
              strokeLinejoin="round"
            />
            <path
              id="Vector_2"
              d="M4 15.6667H10.9583C11.244 15.6667 11.516 15.5445 11.7058 15.331L14.8081 11.8408C15.2059 11.3933 15.9052 11.3933 16.303 11.8408L20 16"
              stroke={active ? 'white' : '#1B1E24'}
              strokeWidth={active ? '2' : '1.5'}
              strokeLinejoin="round"
            />
            <path
              id="Vector_3"
              d="M7 8.5C7 7.67157 7.67157 7 8.5 7C9.32843 7 10 7.67157 10 8.5C10 9.32843 9.32843 10 8.5 10C7.67157 10 7 9.32843 7 8.5Z"
              fill={active ? 'white' : '#1B1E24'}
            />
          </g>
        </g>
      </svg>
    );
  }

  if (shape === 'feed') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="Group 39793">
          <g id="Group 39792">
            <rect
              id="Rectangle 2119"
              x="4"
              y="4"
              width="6"
              height="16"
              rx="2"
              stroke={active ? 'var(--primary-color)' : '#1B1E24'}
              fill={active ? 'var(--primary-color)' : 'none'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              id="Rectangle 2120"
              x="14"
              y="4"
              width="6"
              height="6"
              rx="2"
              stroke={active ? 'var(--primary-color)' : '#1B1E24'}
              fill={active ? 'var(--primary-color)' : 'none'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <rect
              id="Rectangle 2121"
              x="14"
              y="14"
              width="6"
              height="6"
              rx="2"
              stroke={active ? 'var(--primary-color)' : '#1B1E24'}
              fill={active ? 'var(--primary-color)' : 'none'}
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </g>
        </g>
      </svg>
    );
  }

  if (shape === 'create') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M16.8253 11.055L8.05187 19.8284H4.00262L4 15.7766L12.7734 7.00317L16.8253 11.055Z"
          stroke={active ? 'var(--primary-color)' : '#1B1E24'}
          fill={active ? 'var(--primary-color)' : 'none'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.7734 7.00319L14.2843 5.49237C14.9407 4.83588 16.0051 4.83588 16.6616 5.49237L18.3361 7.16688C18.9926 7.82337 18.9926 8.88775 18.3361 9.54424L16.8253 11.0551V11.0551"
          stroke={active ? 'var(--primary-color)' : '#1B1E24'}
          fill={active ? 'var(--primary-color)' : 'none'}
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (shape === 'my') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M12 13C9.79086 13 8 11.2091 8 9C8 6.79086 9.79086 5 12 5C14.2091 5 16 6.79086 16 9C16 11.2091 14.2091 13 12 13Z"
          stroke="#1B1E24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M20 21C19.2381 18.037 16.5714 16.5555 12 16.5555C7.42857 16.5555 4.7619 18.037 4 21"
          stroke="#1B1E24"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }
}

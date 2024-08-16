export default function MobileConnectBoxIcons({ shape }) {
  if (shape === 'favorites') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M6 20V5C6 4.44772 6.44772 4 7 4H17C17.5523 4 18 4.44772 18 5V20L12 17L6 20Z"
          stroke="#1B1E24"
          strokeWidth="2"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (shape === 'wallet') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M4 7.8621V17.4483C4 18.5529 4.89543 19.4483 6 19.4483H18C19.1046 19.4483 20 18.5529 20 17.4483V9.8621C20 8.75753 19.1046 7.8621 18 7.8621H15.5862M4 7.8621V6.55176C4 5.44719 4.89543 4.55176 6 4.55176H13.5862C14.6908 4.55176 15.5862 5.44719 15.5862 6.55176V7.8621M4 7.8621H15.5862"
          stroke="#1B1E24"
          strokeWidth="2"
        />
        <path
          d="M14.4828 13.6553L16.6897 13.6553"
          stroke="#1B1E24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (shape === 'notifications') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5 17H7M7 17H17M7 17V11C7 8.23858 9.23858 6 12 6C14.7614 6 17 8.23858 17 11V17M17 17H19M11.5 5.5V4C11.5 3.72386 11.7239 3.5 12 3.5C12.2761 3.5 12.5 3.72386 12.5 4V5.5M13 20C13 20.5523 12.5523 21 12 21C11.4477 21 11 20.5523 11 20H13Z"
          stroke="#1B1E24"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (shape === 'upgrade to partner') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.93333 19H19M5.93333 15.2667H19L19.9333 6.86667L16.2 9.66667L12.4667 5L8.73333 9.66667L5 6.86667L5.93333 15.2667Z"
          stroke="black"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    );
  }

  if (shape === 'help') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="book">
          <path
            id="Vector 138"
            d="M18 16V4H8C6.89543 4 6 4.89543 6 6V18"
            stroke="#1B1E24"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            id="Vector 139"
            d="M18 20H8C6.89543 20 6 19.1046 6 18C6 16.8954 6.89543 16 8 16H18C17.3274 17.6131 17.3395 18.488 18 20Z"
            stroke="#1B1E24"
            strokeWidth="2"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }

  if (shape === 'sign out') {
    return (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g id="logout">
          <path
            id="Vector"
            d="M19 12C19 12 14.3195 12 11 12M17 15L20 12L17 9M14 7L14 6C14 4.89543 13.1046 4 12 4L7 4C5.89543 4 5 4.89543 5 6L5 18C5 19.1046 5.89543 20 7 20L12 20C13.1046 20 14 19.1046 14 18L14 17"
            stroke="#9BA1A8"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </g>
      </svg>
    );
  }
}

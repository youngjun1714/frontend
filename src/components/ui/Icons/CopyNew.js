const CopyNew = ({ color }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M2.75 11.5H1.875C1.39175 11.5 1 11.1082 1 10.625V1.875C1 1.39175 1.39175 1 1.875 1H10.625C11.1082 1 11.5 1.39175 11.5 1.875V2.75M5.375 15H14.125C14.6082 15 15 14.6082 15 14.125V5.375C15 4.89175 14.6082 4.5 14.125 4.5H5.375C4.89175 4.5 4.5 4.89175 4.5 5.375V14.125C4.5 14.6082 4.89175 15 5.375 15Z"
      stroke={color || 'var(--artiside-neutral2)'}
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
);

export default CopyNew;

const InputSend = ({ color }) => (
  <svg
    width="32"
    height="32"
    viewBox="0 0 32 32"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path
      d="M9.91218 10.5322L24.2788 16.2788L9.91218 22.0254L12.7855 16.2788L9.91218 10.5322Z"
      stroke={color ? color : '#CED3D8'}
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default InputSend;

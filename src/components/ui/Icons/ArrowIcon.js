import React from 'react';

function ArrowIcon(props) {
  const { className, color, direction, dimension } = props;

  const getRotate = () => {
    if (direction === 'down') {
      return 'rotate(90deg)';
    }
    if (direction === 'left') {
      return 'rotate(180deg)';
    }
    if (direction === 'up') {
      return 'rotate(270deg)';
    }
    if (direction === 'right') {
      return 'rotate(360deg)';
    }
  };

  return (
    <svg
      className={className}
      style={{
        width: dimension,
        height: dimension,
        transform: getRotate(),
        transition: '0.2s',
      }}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M7.91602 15.3335L12.416 10.5835L7.91602 5.8335"
        stroke={color ? color : '#888888'}
      />
    </svg>
  );
}

export default ArrowIcon;

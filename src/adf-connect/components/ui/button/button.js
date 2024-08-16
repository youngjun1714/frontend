import React from 'react';
import styles from './button.module.scss';
import classNames from 'classnames';

function Button(props) {
  const { children, type, size = 'md', disabled, onClick, className } = props;
  const buttonClassName = classNames(styles.button, {
    [styles[type]]: type,
    [styles[size]]: size,
    [className]: className,
  });

  const handleClick = async () => {
    onClick && onClick();
  };
  return (
    <button
      className={buttonClassName}
      disabled={disabled}
      onClick={handleClick}
    >
      {children}
    </button>
  );
}

export default Button;

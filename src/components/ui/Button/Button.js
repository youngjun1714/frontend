import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import styles from './Button.module.scss';
import { CircularProgress } from '@mui/material';

function Button(props) {
  const {
    children,
    color,
    type,
    size = 'md',
    disabled,
    onClick,
    className,
    bgColor,
    isLoading,
  } = props;

  const buttonClassName = classNames(styles.button, {
    [styles[type]]: type,
    [styles[size]]: size,
    [styles[bgColor]]: bgColor,
    [className]: className,
  });

  const handleClick = () => {
    if (onClick) {
      onClick();
    }
  };

  return (
    <button
      style={{ background: bgColor, color: color }}
      className={buttonClassName}
      disabled={disabled}
      onClick={handleClick}
    >
      {isLoading && (
        <div className={styles.circular}>
          <CircularProgress
            thickness={5}
            sx={{
              width: '24px !important',
              height: '24px !important',
              color: 'var(--primary-color)',
            }}
          />
        </div>
      )}
      <span>{children}</span>
    </button>
  );
}

Button.propTypes = {
  children: PropTypes.node,
  color: PropTypes.string,
  type: PropTypes.oneOf(['primary', 'secondary']),
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg']),
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
  className: PropTypes.string,
  bgColor: PropTypes.string,
};

Button.defaultProps = {
  size: 'md',
};

export default Button;

import React from 'react';
import styles from './box.module.scss';
import classNames from 'classnames';

function Box(props) {
  const { children, type } = props;
  const boxClassName = classNames(styles.box, {
    [styles[type]]: type,
  });

  return <div className={boxClassName}>{children}</div>;
}

export default Box;

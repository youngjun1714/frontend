import React from 'react';

import styles from './Box.module.scss';

function Box({ children, padding, fixedHeightSize, overflow }) {
  return (
    <div
      className={styles.box}
      style={{
        maxHeight: fixedHeightSize,
        minHeight: fixedHeightSize,
        overflow: overflow,
      }}
    >
      <div style={{ padding: padding }}>{children}</div>
    </div>
  );
}

export default Box;

Box.defaultProps = {
  padding: '60px 53px 70px',
  maxHeight: 'none',
  minHeight: 'none',
  overflow: 'auto',
};

import React from 'react';
import classNames from 'classnames';
import styles from './StatusLabel.module.scss';

const StatusLabel = ({ label, size = 'md' }) =>
  label === 'LIVE' ? (
    <div
      className={classNames(styles.label, styles.live, {
        [styles[size]]: size,
      })}
    >
      LIVE
    </div>
  ) : (
    <div
      className={classNames(styles.label, styles.close, {
        [styles[size]]: size,
      })}
    >
      Closed
    </div>
  );

export default StatusLabel;

import React from 'react';
import classNames from 'classnames';
import styles from './DayCounter.module.scss';

const allWeek = [1, 2, 3, 4, 5, 6, 7];

const DayCounter = ({ leftDays }) => (
  <div className={styles.dayCounter}>
    {allWeek.map((day) => (
      <div
        className={classNames(styles.day, {
          [styles.hasPassed]: day <= 7 - leftDays,
        })}
        key={day}
      />
    ))}
  </div>
);

export default DayCounter;

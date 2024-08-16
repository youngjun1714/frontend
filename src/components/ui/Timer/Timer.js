/* eslint-disable react/prop-types */
import React from 'react';
import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import moment from 'moment';
import classNames from 'classnames';
import styles from './Timer.module.scss';
import DayCounter from '@/components/ui/DayCounter/DayCounter';

function Timer({ expiryTimestamp, onHandleExpired, needDayCounter }) {
  const [isEnd, setisEnd] = useState(false);
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: moment(expiryTimestamp),
    onExpire: () => {
      onHandleExpired && onHandleExpired();
      setisEnd(!isEnd);
    },
  });
  return (
    <>
      <div className={`${styles.timer} ${styles.regularTimer}`}>
        <div
          className={classNames(styles.timerWrap, { [styles.isZero]: !days })}
        >
          <span className={styles.number}>
            {days < 10 ? 0 + String(days) : days}
          </span>
          <span className={styles.unit}>Days</span>
        </div>
        <div className={styles.divider}>:</div>
        <div
          className={classNames(styles.timerWrap, {
            [styles.isZero]: !hours && !days,
          })}
        >
          <span className={styles.number}>
            {hours < 10 ? 0 + String(hours) : hours}
          </span>
          <span className={styles.unit}>Hrs</span>
        </div>
        <div className={styles.divider}>:</div>
        <div
          className={classNames(styles.timerWrap, {
            [styles.isZero]: !minutes && !hours && !days,
          })}
        >
          <span className={styles.number}>
            {minutes < 10 ? 0 + String(minutes) : minutes}
          </span>
          <span className={styles.unit}>Min</span>
        </div>
        <div className={styles.divider}>:</div>
        <div
          className={classNames(styles.timerWrap, {
            [styles.isZero]: !seconds && !minutes && !hours && !days,
          })}
        >
          <span className={styles.number}>
            {seconds < 10 ? 0 + String(seconds) : seconds}
          </span>
          <span className={styles.unit}>Sec</span>
        </div>
      </div>
      {needDayCounter && <DayCounter leftDays={days} />}
    </>
  );
}

export default Timer;

/* eslint-disable react/prop-types */
import React, { useEffect } from 'react';
import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import moment from 'moment';
import styles from './verify-timer.module.scss';

function Timer({ expiryTimestamp, onHandleExpired }) {
  const [isEnd, setisEnd] = useState(false);
  const { seconds, minutes, restart } = useTimer({
    expiryTimestamp: moment(expiryTimestamp),
    onExpire: () => {
      onHandleExpired && onHandleExpired();
      setisEnd(!isEnd);
    },
  });

  useEffect(() => {
    if (expiryTimestamp) {
      restart(expiryTimestamp);
      setisEnd(false);
    }
  }, [expiryTimestamp]);

  return (
    <div>
      <div className={isEnd ? styles.isEnd : ''}>
        <span>{minutes < 10 ? 0 + String(minutes) : minutes}</span>
        <span className="connect">:</span>
        <span>{seconds < 10 ? 0 + String(seconds) : seconds}</span>
      </div>
    </div>
  );
}

export default Timer;

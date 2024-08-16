/* eslint-disable react/prop-types */
import React from 'react';
import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import moment from 'moment';

function SeedingTimer({ expiryTimestamp, onHandleExpired }) {
  const [isEnd, setisEnd] = useState(false);
  const { minutes, hours, days } = useTimer({
    expiryTimestamp: moment(expiryTimestamp),
    onExpire: () => {
      onHandleExpired && onHandleExpired();
      setisEnd(!isEnd);
    },
  });
  return (
    <span>
      <span>{days}</span>
      <span>Days </span>

      <span>{hours < 10 ? 0 + String(hours) : hours}</span>
      <span>:</span>
      <span>{minutes < 10 ? 0 + String(minutes) : minutes}</span>
    </span>
  );
}

export default SeedingTimer;

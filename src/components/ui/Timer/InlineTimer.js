/* eslint-disable react/prop-types */
import React from 'react';
import { useState } from 'react';
import { useTimer } from 'react-timer-hook';
import moment from 'moment';

function InlineTimer({ expiryTimestamp, onHandleExpired }) {
  const [isEnd, setisEnd] = useState(false);
  const { seconds, minutes, hours, days } = useTimer({
    expiryTimestamp: moment(expiryTimestamp),
    onExpire: () => {
      onHandleExpired && onHandleExpired();
      setisEnd(!isEnd);
    },
  });
  return (
    <span>
      <span>{days}</span>
      <span> Day </span>

      <span>{hours < 10 ? 0 + String(hours) : hours}</span>
      <span>:</span>
      <span>{minutes < 10 ? 0 + String(minutes) : minutes}</span>
      <span>:</span>
      <span>{seconds < 10 ? 0 + String(seconds) : seconds}</span>
    </span>
  );
}

export default InlineTimer;

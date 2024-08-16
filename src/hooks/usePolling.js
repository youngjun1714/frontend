import { useState, useEffect } from 'react';

const POLL_INTERVAL = 1000;
const DELAY = 30000;

const usePolling = ({ startPolling, stopPolling, dependencies = [] }) => {
  const [isPolling, setIsPolling] = useState(false);

  useEffect(() => {
    if (isPolling) {
      stopPolling();
      setIsPolling(false);
    }
  }, dependencies);

  const handleStartPolling = () => {
    setIsPolling(true);
    startPolling(POLL_INTERVAL);
    setTimeout(() => {
      stopPolling();
      setIsPolling(false);
    }, DELAY);
  };

  return {
    handleStartPolling,
    isPolling,
  };
};

export default usePolling;

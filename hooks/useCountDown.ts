import { useState, useEffect, useRef } from 'react';

const useCountdown = ({ count }: { count: number }) => {
  const [seconds, setSeconds] = useState(count);
  const intervalRef = useRef<any>();

  const startTheCountdown = () => {
    intervalRef.current = setInterval(() => {
      setSeconds((secondCount) => secondCount - 1);
    }, 1000);
  };

  const clearTheCountdown = () => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
  };

  useEffect(() => () => clearTheCountdown(), []);

  useEffect(() => {
    if (seconds === 0) {
      clearInterval(intervalRef.current);
      setSeconds(count);
    }
  }, [seconds]);

  return {
    startTheCountdown,
    clearTheCountdown,
    seconds,
  };
};

export default useCountdown;

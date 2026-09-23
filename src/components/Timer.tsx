import { useState, useEffect, useRef } from 'react';
import './Timer.css';

interface TimerProps {
  startTime: number;
  paused: boolean;
  onExpired: () => void;
}

export default function Timer({ startTime, paused, onExpired }: TimerProps) {
  const [remaining, setRemaining] = useState<string>('65:00');
  const [isExpired, setIsExpired] = useState(false);
  const pausedElapsedTimeRef = useRef(0);
  const pausedAtTimeRef = useRef<number | null>(null);

  const EXAM_DURATION_MS = 65 * 60 * 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) {
        // Record when pause started
        if (pausedAtTimeRef.current === null) {
          pausedAtTimeRef.current = Date.now();
          console.log('Timer paused at:', pausedAtTimeRef.current);
        }
        return;
      }

      // If we were just paused, add the pause duration to total paused time
      if (pausedAtTimeRef.current !== null) {
        const pausedDuration = Date.now() - pausedAtTimeRef.current;
        pausedElapsedTimeRef.current += pausedDuration;
        console.log('Timer resumed. Paused for:', pausedDuration, 'ms. Total paused:', pausedElapsedTimeRef.current);
        pausedAtTimeRef.current = null;
      }

      const now = Date.now();
      const elapsed = now - startTime - pausedElapsedTimeRef.current;
      const timeLeft = Math.max(0, EXAM_DURATION_MS - elapsed);

      if (timeLeft === 0) {
        setIsExpired(true);
        setRemaining('00:00');
        onExpired();
        clearInterval(interval);
        return;
      }

      const minutes = Math.floor(timeLeft / (60 * 1000));
      const seconds = Math.floor((timeLeft % (60 * 1000)) / 1000);

      setRemaining(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, paused, onExpired]);

  const minutes = parseInt(remaining.split(':')[0]);
  const isLowTime = minutes < 5;
  const isCritical = minutes < 2;

  return (
    <div className={`timer ${isCritical ? 'critical' : isLowTime ? 'low' : ''}`}>
      <span className="timer-label">Time Remaining</span>
      <span className="timer-display">{remaining}</span>
    </div>
  );
}

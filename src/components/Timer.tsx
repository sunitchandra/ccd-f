import { useState, useEffect } from 'react';
import './Timer.css';

interface TimerProps {
  startTime: number;
  paused: boolean;
  onExpired: () => void;
}

export default function Timer({ startTime, paused, onExpired }: TimerProps) {
  const [remaining, setRemaining] = useState<string>('65:00');
  const [isExpired, setIsExpired] = useState(false);

  const EXAM_DURATION_MS = 65 * 60 * 1000;

  useEffect(() => {
    const interval = setInterval(() => {
      if (paused) return;

      const now = Date.now();
      const elapsed = now - startTime;
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

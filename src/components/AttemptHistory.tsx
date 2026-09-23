import { ExamAttempt } from '../types';
import './AttemptHistory.css';

interface AttemptHistoryProps {
  attempts: ExamAttempt[];
}

export default function AttemptHistory({ attempts }: AttemptHistoryProps) {
  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
  };

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  return (
    <div className="attempt-history">
      <table className="history-table">
        <thead>
          <tr>
            <th>Attempt</th>
            <th>Date & Time</th>
            <th>Score</th>
            <th>Percentage</th>
            <th>Result</th>
            <th>Time Taken</th>
          </tr>
        </thead>
        <tbody>
          {attempts.map((attempt, index) => (
            <tr key={attempt.id} className={attempt.passed ? 'passed' : 'failed'}>
              <td className="attempt-number">#{index + 1}</td>
              <td className="date">{formatDate(attempt.submittedAt)}</td>
              <td className="score">{attempt.score.toFixed(1)}/30</td>
              <td className="percentage">{attempt.percentage.toFixed(1)}%</td>
              <td className={`result ${attempt.passed ? 'passed' : 'failed'}`}>
                {attempt.passed ? '✓ PASSED' : '✗ FAILED'}
              </td>
              <td className="time">{formatTime(attempt.timeTaken)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

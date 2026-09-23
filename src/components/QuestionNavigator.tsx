import { RandomizedQuestion } from '../types';
import './QuestionNavigator.css';

interface QuestionNavigatorProps {
  questions: RandomizedQuestion[];
  currentIndex: number;
  answeredIndices: number[];
  onNavigate: (index: number) => void;
}

export default function QuestionNavigator({
  questions,
  currentIndex,
  answeredIndices,
  onNavigate,
}: QuestionNavigatorProps) {
  const columns = 5;
  const rows = Math.ceil(questions.length / columns);

  return (
    <div className="question-navigator">
      <div className="navigator-header">
        <h4>Questions</h4>
        <span className="navigator-count">
          {answeredIndices.length}/{questions.length}
        </span>
      </div>

      <div className="navigator-grid">
        {questions.map((_, index) => {
          const isAnswered = answeredIndices.includes(index);
          const isCurrent = index === currentIndex;

          return (
            <button
              key={index}
              onClick={() => onNavigate(index)}
              className={`navigator-button ${isCurrent ? 'current' : ''} ${
                isAnswered ? 'answered' : ''
              }`}
              title={`Question ${index + 1}${isAnswered ? ' (answered)' : ''}`}
              aria-label={`Question ${index + 1}${isAnswered ? ' answered' : ' unanswered'}`}
              aria-current={isCurrent ? 'true' : 'false'}
            >
              {index + 1}
            </button>
          );
        })}
      </div>

      <div className="navigator-legend">
        <div className="legend-item">
          <div className="legend-square answered"></div>
          <span>Answered</span>
        </div>
        <div className="legend-item">
          <div className="legend-square"></div>
          <span>Unanswered</span>
        </div>
        <div className="legend-item">
          <div className="legend-square current"></div>
          <span>Current</span>
        </div>
      </div>
    </div>
  );
}

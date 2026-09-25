import { RandomizedQuestion, UserAnswer } from '../types';
import './Question.css';

interface QuestionProps {
  question: RandomizedQuestion;
  userAnswer: UserAnswer;
  onAnswerChange: (selectedIndices: number[]) => void;
  struckOutIndices?: number[];
  onToggleStrikeOut?: (optionIndex: number) => void;
}

export default function Question({ question, userAnswer, onAnswerChange, struckOutIndices = [], onToggleStrikeOut }: QuestionProps) {
  const handleOptionChange = (optionIndex: number) => {
    // Don't allow selecting struck-out options
    if (struckOutIndices.includes(optionIndex)) {
      return;
    }

    if (question.type === 'single') {
      onAnswerChange([optionIndex]);
    } else {
      const selected = new Set(userAnswer.selectedIndices);
      if (selected.has(optionIndex)) {
        selected.delete(optionIndex);
      } else {
        selected.add(optionIndex);
      }
      onAnswerChange(Array.from(selected).sort((a, b) => a - b));
    }
  };

  return (
    <div className="question">
      <div className="question-header">
        <h3 className="question-text">{question.question}</h3>
        <span className="question-type">
          {question.type === 'single' ? '✓ Select one' : '✓ Select all that apply'}
        </span>
      </div>

      <div className="options-list">
        {question.options.map((option, index) => {
          const isStruckOut = struckOutIndices.includes(index);
          return (
            <label key={index} className={`option-label ${isStruckOut ? 'struck-out' : ''}`}>
              <input
                type={question.type === 'single' ? 'radio' : 'checkbox'}
                name={`question-${question.id}`}
                checked={userAnswer.selectedIndices.includes(index)}
                onChange={() => handleOptionChange(index)}
                disabled={isStruckOut}
                className="option-input"
              />
              <span className="option-text">{option}</span>
              <span className="option-indicator">
                {question.type === 'single' && (
                  <span className="radio-indicator"></span>
                )}
                {question.type === 'multiple' && (
                  <span className="checkbox-indicator"></span>
                )}
              </span>
              {onToggleStrikeOut && (
                <button
                  type="button"
                  className="strike-button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onToggleStrikeOut(index);
                  }}
                  onMouseDown={(e) => {
                    e.stopPropagation();
                  }}
                  title={isStruckOut ? 'Remove strike-out' : 'Strike out this option'}
                >
                  {isStruckOut ? '✓' : '✕'}
                </button>
              )}
            </label>
          );
        })}
      </div>
    </div>
  );
}

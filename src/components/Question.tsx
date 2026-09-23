import { RandomizedQuestion, UserAnswer } from '../types';
import './Question.css';

interface QuestionProps {
  question: RandomizedQuestion;
  userAnswer: UserAnswer;
  onAnswerChange: (selectedIndices: number[]) => void;
}

export default function Question({ question, userAnswer, onAnswerChange }: QuestionProps) {
  const handleOptionChange = (optionIndex: number) => {
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
        {question.options.map((option, index) => (
          <label key={index} className="option-label">
            <input
              type={question.type === 'single' ? 'radio' : 'checkbox'}
              name={`question-${question.id}`}
              checked={userAnswer.selectedIndices.includes(index)}
              onChange={() => handleOptionChange(index)}
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
          </label>
        ))}
      </div>
    </div>
  );
}

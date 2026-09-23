import { useState } from 'react';
import { ExamAttempt, RandomizedQuestion, UserAnswer } from '../types';
import { scoreQuestion, getPassingScore } from '../utils/scoring';
import './ResultsPage.css';

interface ResultsPageProps {
  attempt: ExamAttempt;
  onBackToDashboard: () => void;
}

export default function ResultsPage({ attempt, onBackToDashboard }: ResultsPageProps) {
  const [expandedQuestion, setExpandedQuestion] = useState<string | null>(null);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  };

  const getAnswerForQuestion = (questionId: string): UserAnswer | undefined => {
    return attempt.userAnswers.find(a => a.questionId === questionId);
  };

  const unansweredCount = attempt.questions.filter(
    q => !attempt.userAnswers.find(a => a.questionId === q.id && a.selectedIndices.length > 0)
  ).length;

  const answeredCount = attempt.userAnswers.filter(a => a.selectedIndices.length > 0).length;
  const correctCount = Math.round(attempt.score);
  const incorrectCount = answeredCount - correctCount;

  return (
    <div className="results-page">
      <header className="results-header">
        <h1>Exam Complete!</h1>
      </header>

      <div className="container">
        {/* Results Summary */}
        <div className="results-summary card">
          <div className="result-status">
            <div className={`status-badge ${attempt.passed ? 'passed' : 'failed'}`}>
              {attempt.passed ? '✓ PASSED' : '✗ FAILED'}
            </div>
            <div className="status-message">
              {attempt.passed
                ? 'Congratulations! You have passed the exam.'
                : 'You have not passed the exam. Please review and try again.'}
            </div>
          </div>

          <div className="score-grid">
            <div className="score-item">
              <div className="score-label">Score</div>
              <div className="score-value">{attempt.score.toFixed(1)}/30</div>
            </div>
            <div className="score-item">
              <div className="score-label">Percentage</div>
              <div className="score-value">{attempt.percentage.toFixed(1)}%</div>
            </div>
            <div className="score-item">
              <div className="score-label">Passing Score</div>
              <div className="score-value">{getPassingScore()}/30 (72%)</div>
            </div>
            <div className="score-item">
              <div className="score-label">Time Taken</div>
              <div className="score-value">{formatTime(attempt.timeTaken)}</div>
            </div>
          </div>

          <div className="answer-breakdown">
            <div className="breakdown-item correct">
              <span className="breakdown-icon">✓</span>
              <div>
                <div className="breakdown-label">Correct</div>
                <div className="breakdown-value">{Math.round(attempt.score)}</div>
              </div>
            </div>
            <div className="breakdown-item incorrect">
              <span className="breakdown-icon">✗</span>
              <div>
                <div className="breakdown-label">Incorrect</div>
                <div className="breakdown-value">{incorrectCount}</div>
              </div>
            </div>
            <div className="breakdown-item unanswered">
              <span className="breakdown-icon">-</span>
              <div>
                <div className="breakdown-label">Unanswered</div>
                <div className="breakdown-value">{unansweredCount}</div>
              </div>
            </div>
          </div>
        </div>

        {/* Detailed Review */}
        <div className="review-section card">
          <h2>📋 Detailed Review</h2>
          <div className="questions-review">
            {attempt.questions.map((question, index) => {
              const userAnswer = getAnswerForQuestion(question.id);
              const isExpanded = expandedQuestion === question.id;
              const { score: questionScore, isCorrect } = scoreQuestion(
                question,
                userAnswer?.selectedIndices || []
              );
              const isUnanswered = !userAnswer || userAnswer.selectedIndices.length === 0;

              return (
                <div key={question.id} className="review-item">
                  <div
                    className="review-header"
                    onClick={() =>
                      setExpandedQuestion(isExpanded ? null : question.id)
                    }
                  >
                    <div className="review-status">
                      <span
                        className={`status-icon ${
                          isUnanswered ? 'unanswered' : isCorrect ? 'correct' : 'incorrect'
                        }`}
                      >
                        {isUnanswered ? '–' : isCorrect ? '✓' : '✗'}
                      </span>
                      <div className="review-title">
                        <div className="question-number">Question {index + 1}</div>
                        <div className="question-summary">{question.question}</div>
                      </div>
                    </div>
                    <div className="review-score">
                      {isUnanswered ? 'Unanswered' : `${questionScore.toFixed(1)}/1`}
                    </div>
                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                  </div>

                  {isExpanded && (
                    <div className="review-details">
                      <div className="options-review">
                        {question.options.map((option, optionIndex) => {
                          const isCorrectAnswer = question.correctAnswers.includes(optionIndex);
                          const userSelected = userAnswer?.selectedIndices.includes(optionIndex);

                          return (
                            <div
                              key={optionIndex}
                              className={`option-review ${
                                isCorrectAnswer ? 'correct-answer' : ''
                              } ${userSelected && !isCorrectAnswer ? 'wrong-answer' : ''} ${
                                userSelected && isCorrectAnswer ? 'correct-selected' : ''
                              }`}
                            >
                              <div className="option-indicators">
                                {userSelected && isCorrectAnswer && (
                                  <span className="indicator correct">✓ Your answer</span>
                                )}
                                {userSelected && !isCorrectAnswer && (
                                  <span className="indicator wrong">✗ Your answer</span>
                                )}
                                {!userSelected && isCorrectAnswer && (
                                  <span className="indicator correct">✓ Correct answer</span>
                                )}
                              </div>
                              <div className="option-text-review">{option}</div>
                            </div>
                          );
                        })}
                      </div>

                      <div className="explanation-box">
                        <h4>Explanation</h4>
                        <p>{question.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          <button onClick={onBackToDashboard} className="btn-primary btn-large">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

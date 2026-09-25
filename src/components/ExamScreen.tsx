import { useState, useEffect } from 'react';
import { CurrentExam, ExamAttempt, UserAnswer, RandomizedQuestion } from '../types';
import { saveCurrentExam, saveExamAttempt, getUserName } from '../db/database';
import { calculateScore, getPassingScore } from '../utils/scoring';
import Timer from './Timer';
import QuestionNavigator from './QuestionNavigator';
import Question from './Question';
import './ExamScreen.css';

interface ExamScreenProps {
  exam: CurrentExam;
  onComplete: (attempt: ExamAttempt) => void;
  onCancel: () => void;
}

export default function ExamScreen({ exam: initialExam, onComplete, onCancel }: ExamScreenProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<UserAnswer[]>(initialExam.userAnswers);
  const [paused, setPaused] = useState(initialExam.paused);
  const [showPauseScreen, setShowPauseScreen] = useState(paused);
  const [autoSubmitWarning, setAutoSubmitWarning] = useState(false);
  const [struckOutOptions, setStruckOutOptions] = useState<Map<string, Set<number>>>(
    initialExam.struckOutOptions
      ? new Map(Object.entries(initialExam.struckOutOptions).map(([key, indices]) => [key, new Set(indices)]))
      : new Map()
  );

  const generateUserId = () => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', id);
    }
    return id;
  };

  const userId = generateUserId();
  const currentQuestion = initialExam.questions[currentQuestionIndex];
  const answeredCount = userAnswers.filter(a => a.selectedIndices.length > 0).length;

  const handleTimerExpired = async () => {
    await handleSubmitExam();
  };

  const handlePause = async () => {
    setPaused(true);
    setShowPauseScreen(true);

    const exam: CurrentExam = {
      ...initialExam,
      userAnswers,
      paused: true,
      pausedAt: Date.now(),
      struckOutOptions: Object.fromEntries(
        Array.from(struckOutOptions.entries()).map(([key, set]) => [key, Array.from(set)])
      ),
    };
    await saveCurrentExam(exam);
  };

  const handleResume = () => {
    setPaused(false);
    setShowPauseScreen(false);
  };

  const handleAnswerChange = (selectedIndices: number[]) => {
    const existing = userAnswers.findIndex(a => a.questionId === currentQuestion.id);
    let newAnswers = [...userAnswers];

    if (existing >= 0) {
      newAnswers[existing] = {
        questionId: currentQuestion.id,
        selectedIndices,
      };
    } else {
      newAnswers.push({
        questionId: currentQuestion.id,
        selectedIndices,
      });
    }

    setUserAnswers(newAnswers);

    const exam: CurrentExam = {
      ...initialExam,
      userAnswers: newAnswers,
      struckOutOptions: Object.fromEntries(
        Array.from(struckOutOptions.entries()).map(([key, set]) => [key, Array.from(set)])
      ),
    };
    saveCurrentExam(exam);
  };

  const handleToggleStrikeOut = (optionIndex: number) => {
    const newMap = new Map(struckOutOptions);
    const optionSet = newMap.get(currentQuestion.id) || new Set<number>();
    let newAnswers = [...userAnswers];

    if (optionSet.has(optionIndex)) {
      // Removing strike-out
      optionSet.delete(optionIndex);
    } else {
      // Adding strike-out - remove the selection if it was selected
      const existingAnswerIndex = newAnswers.findIndex(a => a.questionId === currentQuestion.id);
      if (existingAnswerIndex >= 0) {
        const selectedIndices = newAnswers[existingAnswerIndex].selectedIndices.filter(idx => idx !== optionIndex);
        if (selectedIndices.length === 0) {
          // Remove the answer entirely if no options selected
          newAnswers.splice(existingAnswerIndex, 1);
        } else {
          // Update with remaining selected indices
          newAnswers[existingAnswerIndex] = {
            questionId: currentQuestion.id,
            selectedIndices: selectedIndices.sort((a, b) => a - b),
          };
        }
      }

      optionSet.add(optionIndex);
    }

    if (optionSet.size === 0) {
      newMap.delete(currentQuestion.id);
    } else {
      newMap.set(currentQuestion.id, optionSet);
    }

    setStruckOutOptions(newMap);
    setUserAnswers(newAnswers);

    // Save the updated state
    const exam: CurrentExam = {
      ...initialExam,
      userAnswers: newAnswers,
      struckOutOptions: Object.fromEntries(
        Array.from(newMap.entries()).map(([key, set]) => [key, Array.from(set)])
      ),
    };
    saveCurrentExam(exam);
  };

  const handleNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitExam = async () => {
    if (
      userAnswers.length < initialExam.questions.length &&
      !window.confirm(
        `You have answered ${answeredCount} of ${initialExam.questions.length} questions. Are you sure you want to submit?`
      )
    ) {
      return;
    }

    const result = calculateScore(initialExam.questions, userAnswers);

    const attempt: ExamAttempt = {
      id: initialExam.id,
      userId,
      startTime: initialExam.startTime,
      endTime: Date.now(),
      questions: initialExam.questions,
      userAnswers,
      score: result.score,
      percentage: result.percentage,
      passed: result.passed,
      timeTaken: Date.now() - initialExam.startTime,
      submittedAt: Date.now(),
    };

    await saveExamAttempt(attempt);
    onComplete(attempt);
  };

  return (
    <div className="exam-screen">
      {!showPauseScreen && (
        <>
          <header className="exam-header">
            <div className="header-content">
              <div className="header-info">
                <h2>Question {currentQuestionIndex + 1} of {initialExam.questions.length}</h2>
                <p>{answeredCount} / {initialExam.questions.length} answered</p>
              </div>

              <Timer
                startTime={initialExam.startTime}
                paused={paused}
                onExpired={handleTimerExpired}
              />

              <div className="header-controls">
                {!paused && (
                  <button onClick={handlePause} className="btn-secondary" title="Pause the exam">
                    ⏸ Pause
                  </button>
                )}
              </div>
            </div>
          </header>

          <div className="exam-content">
            <aside className="sidebar">
              <QuestionNavigator
                questions={initialExam.questions}
                currentIndex={currentQuestionIndex}
                answeredIndices={userAnswers
                  .filter(a => a.selectedIndices.length > 0)
                  .map(a => initialExam.questions.findIndex(q => q.id === a.questionId))}
                onNavigate={handleNavigate}
              />
            </aside>

            <main className="main-content">
              <Question
                question={currentQuestion}
                userAnswer={
                  userAnswers.find(a => a.questionId === currentQuestion.id) || {
                    questionId: currentQuestion.id,
                    selectedIndices: [],
                  }
                }
                onAnswerChange={handleAnswerChange}
                struckOutIndices={Array.from(struckOutOptions.get(currentQuestion.id) || [])}
                onToggleStrikeOut={handleToggleStrikeOut}
              />

              <div className="navigation-buttons">
                <button
                  onClick={() => handleNavigate(currentQuestionIndex - 1)}
                  disabled={currentQuestionIndex === 0}
                  className="btn-secondary"
                >
                  ← Previous
                </button>

                <button
                  onClick={() => handleNavigate(currentQuestionIndex + 1)}
                  disabled={currentQuestionIndex === initialExam.questions.length - 1}
                  className="btn-secondary"
                >
                  Next →
                </button>

                <button onClick={handleSubmitExam} className="btn-primary btn-submit">
                  ✓ Submit Exam
                </button>
              </div>
            </main>
          </div>
        </>
      )}

      {showPauseScreen && (
        <div className="pause-overlay">
          <div className="pause-content">
            <h2>Exam Paused</h2>
            <p>Your progress has been saved. Click Resume to continue.</p>
            <button onClick={handleResume} className="btn-primary btn-large">
              ▶ Resume Exam
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

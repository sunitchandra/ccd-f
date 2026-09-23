import { CurrentExam } from '../types';
import { selectRandomQuestions, createRandomizedQuestions } from '../utils/questionBank';
import { saveCurrentExam } from '../db/database';
import './ExamStart.css';

interface ExamStartProps {
  onStartExam: (exam: CurrentExam) => void;
  onCancel: () => void;
}

export default function ExamStart({ onStartExam, onCancel }: ExamStartProps) {
  const handleStartExam = async () => {
    try {
      const questions = selectRandomQuestions(30);
      const randomizedQuestions = createRandomizedQuestions(questions);

      const exam: CurrentExam = {
        id: 'exam_' + Date.now(),
        startTime: Date.now(),
        questions: randomizedQuestions,
        userAnswers: [],
        paused: false,
      };

      await saveCurrentExam(exam);
      onStartExam(exam);
    } catch (error) {
      alert(`Error starting exam: ${error}`);
    }
  };

  return (
    <div className="exam-start">
      <header className="exam-start-header">
        <h1>Claude Certified Developer Exam</h1>
      </header>

      <div className="exam-start-content">
        <div className="exam-info-card">
          <h2>📝 Practice Exam</h2>
          <div className="info-details">
            <div className="detail-item">
              <span className="detail-label">Questions:</span>
              <span className="detail-value">30</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Duration:</span>
              <span className="detail-value">65 Minutes</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Max Score:</span>
              <span className="detail-value">30 Marks</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Passing Score:</span>
              <span className="detail-value">22 Marks (72%)</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Negative Marking:</span>
              <span className="detail-value">No</span>
            </div>
            <div className="detail-item">
              <span className="detail-label">Question Types:</span>
              <span className="detail-value">Single & Multiple Choice</span>
            </div>
          </div>
        </div>

        <div className="exam-notes-card">
          <h3>📌 Important Notes</h3>
          <ul>
            <li>
              <strong>Randomization:</strong> Questions and answer options are randomly shuffled
              for each attempt.
            </li>
            <li>
              <strong>Question Navigation:</strong> You can navigate freely between questions
              without needing to answer them in order.
            </li>
            <li>
              <strong>Pause & Resume:</strong> You can pause the exam at any time. The timer will
              stop and your answers will be saved.
            </li>
            <li>
              <strong>Time Management:</strong> You have 65 minutes total. Make sure to budget
              your time wisely.
            </li>
            <li>
              <strong>Review:</strong> After submission, you can review all questions with
              detailed explanations.
            </li>
            <li>
              <strong>Persistence:</strong> If you lose connection or close the browser, your
              exam will be restored automatically.
            </li>
          </ul>
        </div>

        <div className="exam-scoring-card">
          <h3>🎯 Scoring Rules</h3>
          <div className="scoring-details">
            <div className="scoring-rule">
              <h4>Single-Choice Questions</h4>
              <p>Correct: +1 mark | Wrong: 0 marks | Unanswered: 0 marks</p>
            </div>
            <div className="scoring-rule">
              <h4>Multiple-Choice Questions</h4>
              <p>
                If a question has N correct answers, each correct answer is worth 1/N marks.
              </p>
              <p>Example: If 2 answers are correct and you select both, you get 1 mark.</p>
              <p>Any wrong selection results in 0 marks for that question.</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button onClick={handleStartExam} className="btn-primary btn-large">
            ✓ Start Exam
          </button>
          <button onClick={onCancel} className="btn-secondary btn-large">
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

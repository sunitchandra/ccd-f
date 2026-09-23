import { useState, useEffect } from 'react';
import { getExamAttempts, saveUserName } from '../db/database';
import { ExamAttempt, DashboardStats } from '../types';
import { getQuestionBank } from '../utils/questionBank';
import PerformanceChart from './PerformanceChart';
import AttemptHistory from './AttemptHistory';
import './Dashboard.css';

interface DashboardProps {
  userName: string;
  hasUnfinishedExam: boolean;
  onStartExam: () => void;
  onResumeExam: () => void;
  onViewLibrary: () => void;
  onUserNameChange?: (name: string) => void;
}

export default function Dashboard({
  userName: initialUserName,
  hasUnfinishedExam,
  onStartExam,
  onResumeExam,
  onViewLibrary,
  onUserNameChange,
}: DashboardProps) {
  const [userName, setUserName] = useState(initialUserName);
  const [editingName, setEditingName] = useState(false);
  const [tempName, setTempName] = useState(initialUserName);

  // Update local state when prop changes
  useEffect(() => {
    console.log('Dashboard: userName prop changed to:', initialUserName);
    setUserName(initialUserName);
    setTempName(initialUserName);
  }, [initialUserName]);
  const [stats, setStats] = useState<DashboardStats>({
    userName: initialUserName,
    totalAttempts: 0,
    bestScore: 0,
    averageScore: 0,
    latestScore: 0,
    passCount: 0,
    failCount: 0,
  });
  const [attempts, setAttempts] = useState<ExamAttempt[]>([]);

  const generateUserId = () => {
    let id = localStorage.getItem('userId');
    if (!id) {
      id = 'user_' + Math.random().toString(36).substr(2, 9);
      localStorage.setItem('userId', id);
    }
    return id;
  };

  const userId = generateUserId();

  useEffect(() => {
    const loadStats = async () => {
      const attempts = await getExamAttempts(userId);
      setAttempts(attempts);

      if (attempts.length === 0) {
        setStats({
          userName,
          totalAttempts: 0,
          bestScore: 0,
          averageScore: 0,
          latestScore: 0,
          passCount: 0,
          failCount: 0,
        });
        return;
      }

      const bestScore = Math.max(...attempts.map(a => a.score));
      const averageScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length;
      const latestScore = attempts[attempts.length - 1].score;
      const passCount = attempts.filter(a => a.passed).length;
      const failCount = attempts.length - passCount;

      setStats({
        userName,
        totalAttempts: attempts.length,
        bestScore,
        averageScore,
        latestScore,
        passCount,
        failCount,
      });
    };

    loadStats();
  }, [userName, userId]);

  const handleSaveName = async () => {
    console.log('handleSaveName called with tempName:', tempName);
    if (tempName.trim()) {
      console.log('Saving name:', tempName);
      setUserName(tempName);
      await saveUserName(tempName);
      setEditingName(false);
      // Notify parent component of name change
      onUserNameChange?.(tempName);
      console.log('Name save completed');
    } else {
      console.log('Name is empty, not saving');
    }
  };

  const handleClearHistory = async () => {
    if (
      window.confirm(
        'Are you sure you want to delete all exam history? This cannot be undone.'
      )
    ) {
      const { deleteAllAttempts } = await import('../db/database');
      await deleteAllAttempts();
      setAttempts([]);
      setStats({
        userName,
        totalAttempts: 0,
        bestScore: 0,
        averageScore: 0,
        latestScore: 0,
        passCount: 0,
        failCount: 0,
      });
    }
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="container">
          <h1>Claude Certified Developer</h1>
          <p className="subtitle">Practice Exam</p>
        </div>
      </header>

      <div className="container">
        {/* User Section */}
        <div className="user-section card">
          <div className="user-info">
            {editingName ? (
              <div className="name-edit">
                <input
                  type="text"
                  value={tempName}
                  onChange={e => setTempName(e.target.value)}
                  placeholder="Enter your name"
                />
                <button onClick={handleSaveName} className="btn-primary">
                  Save
                </button>
                <button
                  onClick={() => {
                    setEditingName(false);
                    setTempName(userName);
                  }}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <div className="name-display">
                <p className="label">Welcome,</p>
                <h2>{userName || 'Guest'}</h2>
                <button onClick={() => setEditingName(true)} className="btn-secondary">
                  Edit Name
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="action-buttons">
          {hasUnfinishedExam && (
            <button onClick={onResumeExam} className="btn-success btn-large">
              📝 Resume Previous Exam
            </button>
          )}
          <button onClick={onStartExam} className="btn-primary btn-large">
            ✓ Start New Exam
          </button>
          <button onClick={onViewLibrary} className="btn-secondary btn-large">
            📚 View All Questions
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card card">
            <div className="stat-value">{stats.totalAttempts}</div>
            <div className="stat-label">Total Attempts</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{stats.bestScore.toFixed(1)}/30</div>
            <div className="stat-label">Best Score</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{stats.averageScore.toFixed(1)}/30</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{stats.latestScore.toFixed(1)}/30</div>
            <div className="stat-label">Latest Score</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{stats.passCount}</div>
            <div className="stat-label">Passed</div>
          </div>
          <div className="stat-card card">
            <div className="stat-value">{stats.failCount}</div>
            <div className="stat-label">Failed</div>
          </div>
        </div>

        {/* Performance Chart */}
        {attempts.length > 0 && (
          <div className="chart-section card">
            <h3>Performance Trend</h3>
            <PerformanceChart attempts={attempts} />
          </div>
        )}

        {/* Attempt History */}
        {attempts.length > 0 && (
          <div className="history-section card">
            <h3>Attempt History</h3>
            <AttemptHistory attempts={attempts} />
          </div>
        )}

        {/* Clear History Button */}
        {attempts.length > 0 && (
          <div className="clear-history-section">
            <button onClick={handleClearHistory} className="btn-danger">
              🗑️ Clear Score History
            </button>
          </div>
        )}

        {/* Question Bank Info Box */}
        {(() => {
          const allQuestions = getQuestionBank();
          const singleChoice = allQuestions.filter(q => q.type === 'single').length;
          const multipleChoice = allQuestions.filter(q => q.type === 'multiple').length;
          console.log('Dashboard - Questions loaded:', allQuestions.length, 'Single:', singleChoice, 'Multiple:', multipleChoice);
          return (
            <div className="info-section card">
              <h3>📚 Question Bank</h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '15px', marginBottom: '15px' }}>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#0066cc' }}>{allQuestions.length}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Total Questions</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#28a745' }}>{singleChoice}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Single Choice</div>
                </div>
                <div style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '28px', fontWeight: '700', color: '#ffc107' }}>{multipleChoice}</div>
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>Multiple Choice</div>
                </div>
              </div>
              <button onClick={onViewLibrary} style={{ width: '100%', padding: '12px', background: '#0066cc', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '14px', transition: 'background-color 0.2s' }} onMouseEnter={(e) => e.currentTarget.style.background = '#0052a3'} onMouseLeave={(e) => e.currentTarget.style.background = '#0066cc'}>
                Explore Questions Library →
              </button>
            </div>
          );
        })()}

        {/* Exam Info Box */}
        <div className="info-section card">
          <h3>📋 Exam Information</h3>
          <ul>
            <li><strong>Questions per Session:</strong> 30</li>
            <li><strong>Duration:</strong> 65 minutes</li>
            <li><strong>Passing Score:</strong> 22/30 (72%)</li>
            <li><strong>Maximum Score:</strong> 30</li>
            <li><strong>Negative Marking:</strong> No</li>
            <li><strong>Question Types:</strong> Single and Multiple Choice</li>
            <li><strong>Note:</strong> Questions and options are randomized each attempt</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

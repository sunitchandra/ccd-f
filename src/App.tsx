import { useState, useEffect } from 'react';
import Dashboard from './components/Dashboard';
import ExamStart from './components/ExamStart';
import ExamScreen from './components/ExamScreen';
import ResultsPage from './components/ResultsPage';
import QuestionsLibrary from './components/QuestionsLibrary';
import { getCurrentExam, getUserName, deleteCurrentExam } from './db/database';
import { ExamAttempt, CurrentExam } from './types';
import './App.css';

type AppState = 'dashboard' | 'start' | 'exam' | 'results' | 'library';

export default function App() {
  const [appState, setAppState] = useState<AppState>('dashboard');
  const [currentExam, setCurrentExam] = useState<CurrentExam | null>(null);
  const [completedAttempt, setCompletedAttempt] = useState<ExamAttempt | null>(null);
  const [userName, setUserName] = useState<string>('');
  const [hasUnfinishedExam, setHasUnfinishedExam] = useState(false);

  useEffect(() => {
    const init = async () => {
      console.log('App.tsx useEffect: Loading user data...');
      const name = await getUserName();
      console.log('App.tsx: Retrieved name from database:', name);
      setUserName(name);

      const unfinished = await getCurrentExam();
      if (unfinished) {
        setHasUnfinishedExam(true);
        setCurrentExam(unfinished);
      }
    };
    init();
  }, []);

  const handleStartExam = async (exam: CurrentExam) => {
    setCurrentExam(exam);
    setAppState('exam');
    setHasUnfinishedExam(false);
  };

  const handleExamComplete = async (attempt: ExamAttempt) => {
    setCompletedAttempt(attempt);
    setCurrentExam(null);
    setAppState('results');
    await deleteCurrentExam();
  };

  const handleResumeExam = () => {
    if (currentExam) {
      setAppState('exam');
      setHasUnfinishedExam(false);
    }
  };

  const handleBackToDashboard = async () => {
    setAppState('dashboard');
    setCurrentExam(null);
    setCompletedAttempt(null);
    // Reload user name in case it was updated
    const name = await getUserName();
    setUserName(name);
  };

  return (
    <div className="app">
      {appState === 'dashboard' && (
        <Dashboard
          userName={userName}
          hasUnfinishedExam={hasUnfinishedExam}
          onStartExam={() => setAppState('start')}
          onResumeExam={handleResumeExam}
          onViewLibrary={() => setAppState('library')}
          onUserNameChange={setUserName}
        />
      )}

      {appState === 'start' && (
        <ExamStart onStartExam={handleStartExam} onCancel={handleBackToDashboard} />
      )}

      {appState === 'exam' && currentExam && (
        <ExamScreen
          exam={currentExam}
          onComplete={handleExamComplete}
          onCancel={handleBackToDashboard}
        />
      )}

      {appState === 'results' && completedAttempt && (
        <ResultsPage attempt={completedAttempt} onBackToDashboard={handleBackToDashboard} />
      )}

      {appState === 'library' && (
        <QuestionsLibrary onBackToDashboard={handleBackToDashboard} />
      )}
    </div>
  );
}

export interface Question {
  id: string;
  question: string;
  options: string[];
  correctAnswers: number[];
  type: 'single' | 'multiple';
  explanation: string;
}

export interface RandomizedQuestion extends Question {
  randomizedIndices: number[];
}

export interface UserAnswer {
  questionId: string;
  selectedIndices: number[];
}

export interface ExamAttempt {
  id: string;
  userId: string;
  startTime: number;
  endTime?: number;
  questions: RandomizedQuestion[];
  userAnswers: UserAnswer[];
  score: number;
  percentage: number;
  passed: boolean;
  timeTaken: number;
  submittedAt: number;
}

export interface DashboardStats {
  userName: string;
  totalAttempts: number;
  bestScore: number;
  averageScore: number;
  latestScore: number;
  passCount: number;
  failCount: number;
}

export interface CurrentExam {
  id: string;
  startTime: number;
  questions: RandomizedQuestion[];
  userAnswers: UserAnswer[];
  paused: boolean;
  pausedAt?: number;
}

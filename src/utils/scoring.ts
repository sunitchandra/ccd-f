import { RandomizedQuestion, UserAnswer } from '../types';

const PASSING_PERCENTAGE = 72;
const MAX_SCORE_PER_QUESTION = 1;
const TOTAL_QUESTIONS = 30;

export function calculateScore(
  questions: RandomizedQuestion[],
  userAnswers: UserAnswer[]
): {
  score: number;
  correctCount: number;
  incorrectCount: number;
  unansweredCount: number;
  percentage: number;
  passed: boolean;
} {
  let score = 0;
  let correctCount = 0;
  let incorrectCount = 0;
  let unansweredCount = 0;

  const answerMap = new Map(userAnswers.map(a => [a.questionId, a]));

  questions.forEach(question => {
    const userAnswer = answerMap.get(question.id);

    if (!userAnswer || userAnswer.selectedIndices.length === 0) {
      unansweredCount++;
      return;
    }

    const { score: questionScore, isCorrect } = scoreQuestion(
      question,
      userAnswer.selectedIndices
    );

    score += questionScore;

    if (isCorrect && questionScore === MAX_SCORE_PER_QUESTION) {
      correctCount++;
    } else if (questionScore === 0) {
      incorrectCount++;
    } else {
      incorrectCount++;
    }
  });

  const maxScore = TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION;
  const percentage = (score / maxScore) * 100;
  const passed = percentage >= PASSING_PERCENTAGE;

  return {
    score,
    correctCount,
    incorrectCount,
    unansweredCount,
    percentage,
    passed,
  };
}

export function scoreQuestion(
  question: RandomizedQuestion,
  selectedIndices: number[]
): {
  score: number;
  isCorrect: boolean;
} {
  const correctSet = new Set(question.correctAnswers);
  const selectedSet = new Set(selectedIndices);

  if (question.type === 'single') {
    if (selectedSet.size !== 1) return { score: 0, isCorrect: false };

    const isCorrect = selectedSet.has(question.correctAnswers[0]);
    return {
      score: isCorrect ? MAX_SCORE_PER_QUESTION : 0,
      isCorrect,
    };
  }

  if (question.type === 'multiple') {
    if (correctSet.size === 0) return { score: 0, isCorrect: false };

    let correctSelections = 0;
    let incorrectSelections = 0;

    selectedIndices.forEach(idx => {
      if (correctSet.has(idx)) {
        correctSelections++;
      } else {
        incorrectSelections++;
      }
    });

    if (incorrectSelections > 0) {
      return { score: 0, isCorrect: false };
    }

    const scorePerCorrectAnswer = MAX_SCORE_PER_QUESTION / correctSet.size;
    const score = correctSelections * scorePerCorrectAnswer;
    const isCorrect = correctSelections === correctSet.size;

    return {
      score: Math.min(score, MAX_SCORE_PER_QUESTION),
      isCorrect,
    };
  }

  return { score: 0, isCorrect: false };
}

export function getPassingScore(): number {
  return (PASSING_PERCENTAGE / 100) * (TOTAL_QUESTIONS * MAX_SCORE_PER_QUESTION);
}

export function getPassingPercentage(): number {
  return PASSING_PERCENTAGE;
}

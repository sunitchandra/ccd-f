import questionBankData from '../../claude_certified_developer_questions_bank.json';
import { Question, RandomizedQuestion } from '../types';

export function getQuestionBank(): Question[] {
  return questionBankData.questions.map(q => ({
    id: q.id,
    question: q.question,
    options: q.options,
    correctAnswers: q.correctAnswers,
    type: q.type as 'single' | 'multiple',
    explanation: q.explanation,
  }));
}

export function validateQuestionBank(): {
  valid: boolean;
  total: number;
  singleChoice: number;
  multipleChoice: number;
  issues: string[];
} {
  const questions = getQuestionBank();
  const issues: string[] = [];
  let singleChoice = 0;
  let multipleChoice = 0;

  questions.forEach((q, index) => {
    if (!q.id) issues.push(`Question ${index}: Missing ID`);
    if (!q.question) issues.push(`Question ${index} (${q.id}): Missing question text`);
    if (!q.options || q.options.length === 0) issues.push(`Question ${index} (${q.id}): Missing options`);
    if (!q.correctAnswers || q.correctAnswers.length === 0) issues.push(`Question ${index} (${q.id}): Missing correct answers`);
    if (!q.explanation) issues.push(`Question ${index} (${q.id}): Missing explanation`);
    if (!q.type) issues.push(`Question ${index} (${q.id}): Missing type`);

    if (q.type === 'single') singleChoice++;
    else if (q.type === 'multiple') multipleChoice++;
  });

  return {
    valid: issues.length === 0,
    total: questions.length,
    singleChoice,
    multipleChoice,
    issues,
  };
}

export function selectRandomQuestions(count: number): Question[] {
  const questions = getQuestionBank();

  if (questions.length < count) {
    throw new Error(
      `Cannot select ${count} questions. Only ${questions.length} available in question bank.`
    );
  }

  const selected: Question[] = [];
  const used = new Set<number>();

  while (selected.length < count) {
    const index = Math.floor(Math.random() * questions.length);
    if (!used.has(index)) {
      selected.push(questions[index]);
      used.add(index);
    }
  }

  return selected;
}

export function randomizeOptions(question: Question): RandomizedQuestion {
  const optionIndices = Array.from({ length: question.options.length }, (_, i) => i);

  for (let i = optionIndices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [optionIndices[i], optionIndices[j]] = [optionIndices[j], optionIndices[i]];
  }

  const randomizedOptions = optionIndices.map(i => question.options[i]);

  const newCorrectAnswers = question.correctAnswers.map(correctIdx =>
    optionIndices.indexOf(correctIdx)
  );

  return {
    ...question,
    options: randomizedOptions,
    correctAnswers: newCorrectAnswers,
    randomizedIndices: optionIndices,
  };
}

export function createRandomizedQuestions(questions: Question[]): RandomizedQuestion[] {
  return questions.map(q => randomizeOptions(q));
}

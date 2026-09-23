import Dexie, { Table } from 'dexie';
import { ExamAttempt, CurrentExam } from '../types';

export interface QuestionBank {
  version: number;
  lastUpdated: number;
}

export class ExamDatabase extends Dexie {
  examAttempts!: Table<ExamAttempt>;
  currentExam!: Table<CurrentExam>;
  userSettings!: Table<any>;
  questionBank!: Table<QuestionBank>;

  constructor() {
    super('CCDVExamDB');
    this.version(1).stores({
      examAttempts: 'id, userId, submittedAt',
      currentExam: 'id',
      userSettings: 'key',
      questionBank: 'version',
    });
  }
}

export const db = new ExamDatabase();

export async function saveUserName(name: string): Promise<void> {
  await db.userSettings.put({ key: 'userName', value: name });
}

export async function getUserName(): Promise<string> {
  const setting = await db.userSettings.where('key').equals('userName').first();
  return setting?.value || '';
}

export async function saveCurrentExam(exam: CurrentExam): Promise<void> {
  await db.currentExam.clear();
  await db.currentExam.put(exam);
}

export async function getCurrentExam(): Promise<CurrentExam | undefined> {
  return await db.currentExam.toCollection().first();
}

export async function deleteCurrentExam(): Promise<void> {
  await db.currentExam.clear();
}

export async function saveExamAttempt(attempt: ExamAttempt): Promise<void> {
  await db.examAttempts.put(attempt);
}

export async function getExamAttempts(userId: string): Promise<ExamAttempt[]> {
  return await db.examAttempts
    .where('userId')
    .equals(userId)
    .sortBy('submittedAt');
}

export async function getExamAttempt(attemptId: string): Promise<ExamAttempt | undefined> {
  return await db.examAttempts.get(attemptId);
}

export async function deleteAllAttempts(): Promise<void> {
  await db.examAttempts.clear();
}

export async function deleteDatabaseStorage(): Promise<void> {
  await db.delete();
  await db.open();
}

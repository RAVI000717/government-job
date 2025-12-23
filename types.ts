
export enum Difficulty {
  EASY = 'Easy',
  MEDIUM = 'Medium',
  HARD = 'Hard'
}

export interface Question {
  id: number;
  text: string;
  options: string[];
  correctAnswer: number; // Index 0-3
  explanation: string;
  difficulty: Difficulty;
  subject: string;
}

export interface ExamType {
  id: string;
  name: string;
  description: string;
  icon: string;
}

export interface Subject {
  id: string;
  name: string;
  icon: string;
}

export interface UserAnswer {
  questionId: number;
  selectedOption: number | null; // null if skipped
  isCorrect: boolean | null;
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  skippedAnswers: number;
  accuracy: number;
  subjectAnalysis: { [key: string]: { correct: number, total: number } };
  aiTips: string;
}

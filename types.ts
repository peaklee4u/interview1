export type Region = 'seoul' | 'gyeonggi' | 'gangwon';

export type QuestionType = 'gusang' | 'jeokdap';

export interface Question {
  id: number;
  type: QuestionType;
  title: string;
  content: string;
  subQuestions?: string[];
}

export interface Evaluation {
  score: number; // 0 to 10
  strengths: string;
  improvements: string;
  modelAnswer: string;
}

export interface AppState {
  step: 'region' | 'upload' | 'generating' | 'interview' | 'evaluating' | 'feedback';
  region: Region | null;
  fileData: string | null; // Base64
  fileMimeType: string | null;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: Record<number, string>; // questionId -> answer
  evaluations: Record<number, Evaluation>;
  error: string | null;
}
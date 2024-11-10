export type QuestionObj = {
  text: string;
  instruction: string;
  alternatives: string[];
};

export type Question = {
  id?: number;
  text: string;
  created_at: string;
  question_type: string;
};

export type QuestionDBM = Question & {
  correctAnswer: string | string[];
  otherAlternatives?: string[];
};

export type AlternativeDBM = {
  id?: number;
  question_id: number;
  text: string;
  is_correct: number;
};

export interface OperationResult<T = null> {
  success: boolean;
  error?: Error;
  message: string;
  data?: T;
}

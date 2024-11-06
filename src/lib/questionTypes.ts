export type QuestionObj = {
  text: string;
  instruction?: string;
  alternatives: string[];
};

export type QuestionDBM = {
  id?: number;
  text: string;
  created_at: string;
  correctAnswer: string | string[];
  otherAlternatives?: string[];
  question_type: string;
};

export type AlternativeDBM = {
  id?: number;
  question_id: number;
  text: string;
  is_correct: number;
};

export interface OperationResult {
  success: boolean;
  error?: Error;
  message: string;
}

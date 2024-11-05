export type QuestionObj = {
  text: string;
  instruction?: string;
  alternatives: string[];
};

export type QuestionDBM<T> = {
  id?: number;
  text: string;
  created_at: string;
  correctAnswer: T;
  otherAlternatives?: string[];
  question_type: string;
};

export type AlternativeDBM = {
  id: number;
  question_id: number;
  text: string;
  is_correct: number;
};

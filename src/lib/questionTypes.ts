export type QuestionObj = {
  text: string;
  instruction?: string;
  alternatives: string[];
};

export type QuestionDBM = {
  id: number;
  text: string;
};

export type AlternativeDBM = {
  id: number;
  question_id: number;
  text: string;
  is_correct: number;
};

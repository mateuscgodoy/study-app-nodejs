import DIFFICULTY from '../lib/enums/difficulty';
import QUESTION_TYPES from '../lib/enums/questionTypes';

export type ID = number | bigint;

export type QuestionData = {
  text: string;
  questionType: QUESTION_TYPES;
  difficulty?: DIFFICULTY;
};

export type QuestionDBM = Omit<QuestionData, 'questionType'> & {
  questionType: string;
  createdAt: string;
};

export type QuestionDisplay = Omit<
  QuestionDBM,
  'correctAnswer' | 'otherAlternatives'
> & {
  id?: ID;
  alternatives: string[];
  instruction: string;
};

export type AlternativeDisplay = {
  text: string;
};

export type AlternativeAnswered = AlternativeDisplay & {
  explanation?: string;
};

export type AlternativeData = AlternativeAnswered & {
  isCorrect: boolean;
};

export type AlternativeDBM = Omit<AlternativeData, 'isCorrect'> & {
  question_id: ID;
  isCorrect: number;
};

// export type TagData = {
//   questionId: ID;
//   tags: string[];
// };

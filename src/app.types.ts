import { Difficulties } from './lib/difficulties';

export type ID = number | bigint;

export type InputQuestion = {
  id?: ID;
  text: string;
  createdAt?: Date;
  difficulty?: Difficulties;
};

export type QuestionDisplay = Omit<
  InputQuestion,
  'createdAt' | 'difficulty'
> & {
  alternatives: string[];
  instruction: string;
  tags: string[];
  createdAt: string;
  difficulty: string;
};

export type QuestionDB = {
  id?: ID;
  text: string;
  createdAt: string;
  questionType: string;
  difficulty: number | null;
};

export type AlternativeDB = {
  text: string;
  isCorrect: number;
  explanation: string | null;
};

export type ThemeDB = {
  name: string;
  displayName: string;
};

export type QuestionTypeDB = {
  id: ID;
  name: string;
};

export type SerializedQuestion = {
  question: QuestionDB;
  alternatives: AlternativeDB[];
  tags: ThemeDB[];
};

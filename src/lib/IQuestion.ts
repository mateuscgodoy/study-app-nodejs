import { QuestionDBM, QuestionObj } from './questionTypes';

export default interface IQuestion<T> {
  text: string;
  instruction?: string;
  correctAnswer: T;
  questionType: string;
  created_at: Date;
  getDisplayQuestion(): QuestionObj;
  checkAnswer(answer: T): boolean;
  serialize(): QuestionDBM<T>;
}

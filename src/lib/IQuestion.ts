import { QuestionObj } from './questionTypes';

export default interface IQuestion<T> {
  text: string;
  instruction?: string;
  correctAnswer: T;
  getDisplayQuestion(): QuestionObj;
  checkAnswer(answer: T): boolean;
}

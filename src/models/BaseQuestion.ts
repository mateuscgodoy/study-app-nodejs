import { QuestionDBM, QuestionObj } from '../lib/questionTypes';

export default abstract class BaseQuestion<T> {
  protected abstract text: string;
  protected abstract correctAnswer: T;
  protected abstract createdAt: Date;

  abstract getDisplayQuestion(): QuestionObj;
  abstract checkAnswer(answer: T): boolean;
  abstract serialize(): QuestionDBM;
  abstract getInstruction(): string;

  static getQuestionType(): string {
    return 'Not defined';
  }
}

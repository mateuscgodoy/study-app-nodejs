import { QuestionDBM, QuestionObj } from '../../types/question.types';
import InvalidQuestionArgument from '../errors/InvalidQuestionArgument';

export default abstract class BaseQuestion<T> {
  protected text: string;
  protected correctAnswer: T;
  protected createdAt: Date;

  constructor(text: string, correctAnswer: T, createdAt?: Date) {
    if (!text.trim().length) {
      throw new InvalidQuestionArgument('Question text must not be empty');
    }
    const currentDate = new Date();
    if (createdAt && createdAt.getTime() > currentDate.getTime()) {
      throw new InvalidQuestionArgument(
        'Creation date may not be in the future'
      );
    }
    if (!this.validateCorrectAnswerInput(correctAnswer)) {
      throw new InvalidQuestionArgument(
        'The correct answer input provided is invalid'
      );
    }

    this.text = text;
    this.correctAnswer = correctAnswer;
    this.createdAt = createdAt ?? currentDate;
  }

  abstract display(): QuestionObj;
  abstract checkAnswer(answer: T): boolean;
  abstract serialize(): QuestionDBM;

  abstract validateCorrectAnswerInput(input: T): boolean;

  static getQuestionType(): string {
    return 'Not defined';
  }
  static getInstruction(): string {
    return '';
  }
}

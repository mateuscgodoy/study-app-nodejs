import DIFFICULTY from '../../lib/enums/difficulty';
import QUESTION_TYPES from '../../lib/enums/questionTypes';
import {
  QuestionDBM,
  Question,
  QuestionDisplay,
} from '../../types/question.types';
import Alternative from './Alternative';

export default abstract class BaseQuestion {
  protected text: string;
  protected alternatives: Alternative[];
  protected tags: string[];
  protected createdAt: Date;
  protected difficulty: DIFFICULTY | null;

  constructor(question: Question, createdAt?: Date) {
    this.text = question.text;
    this.alternatives = question.alternatives;
    this.tags = question.tags ?? [];
    this.createdAt = createdAt ?? new Date();
    this.difficulty = question.difficulty ?? null;
  }

  checkAnswer(answer: string): boolean {
    return this.alternatives.some(
      (alt) =>
        alt.text.toLocaleLowerCase() === answer.toLocaleLowerCase() &&
        alt.isCorrect
    );
  }
  abstract display(): QuestionDisplay;
  abstract serialize(): QuestionDBM; // ! This might need a new place

  static getType(): QUESTION_TYPES {
    return QUESTION_TYPES.NONE;
  }
  static getInstruction(): string {
    return '';
  }
}

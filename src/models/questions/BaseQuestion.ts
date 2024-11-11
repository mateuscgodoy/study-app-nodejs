import DIFFICULTY from '../../lib/enums/difficulty';
import QUESTION_TYPES from '../../lib/enums/questionTypes';
import Serializable from '../../lib/interfaces/Serializable';
import {
  QuestionDBM,
  QuestionData,
  QuestionDisplay,
} from '../../types/question.types';

export default abstract class BaseQuestion
  implements Serializable<QuestionDBM>
{
  protected text: string;
  // protected alternatives: Alternative[];
  protected createdAt: Date;
  protected difficulty: DIFFICULTY | null;

  constructor(question: QuestionData, createdAt?: Date) {
    this.text = question.text;
    // this.alternatives = question.alternatives;
    this.createdAt = createdAt ?? new Date();
    this.difficulty = question.difficulty ?? null;
  }

  abstract display(): QuestionDisplay;
  abstract serialize(): QuestionDBM;
  abstract deserialize(value: QuestionDBM): void;

  static getType(): QUESTION_TYPES {
    return QUESTION_TYPES.NONE;
  }
  static getInstruction(): string {
    return '';
  }
}

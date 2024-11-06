import { QuestionDBM, QuestionObj } from '../lib/questionTypes';
import BaseQuestion from './BaseQuestion';

export default class TrueOrFalseQuestion extends BaseQuestion<boolean> {
  protected text: string;
  protected correctAnswer: boolean;
  protected createdAt: Date;

  constructor(text: string, correctAnswer: boolean, createAt?: Date) {
    super();
    this.text = text;
    this.correctAnswer = correctAnswer;
    this.createdAt = createAt ?? new Date();
  }

  getDisplayQuestion(): QuestionObj {
    return {
      text: this.text,
      instruction: this.getInstruction(),
      alternatives: ['True', 'False'],
    };
  }
  checkAnswer(answer: boolean): boolean {
    return answer === this.correctAnswer;
  }
  serialize(): QuestionDBM {
    return {
      correctAnswer: this.correctAnswer ? 'T' : 'F',
      created_at: this.createdAt.toISOString(),
      text: this.text,
      question_type: TrueOrFalseQuestion.getQuestionType(),
    };
  }
  getInstruction(): string {
    return 'True or False';
  }

  static override getQuestionType(): string {
    return 'true_or_false';
  }
}

import { QuestionDBM, QuestionObj } from '../../lib/questionTypes';
import BaseQuestion from './BaseQuestion';

export default class TrueOrFalseQuestion extends BaseQuestion<boolean> {
  constructor(text: string, correctAnswer: boolean, createAt?: Date) {
    super(text, correctAnswer, createAt);
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
  validateCorrectAnswerInput(input: boolean): boolean {
    return true;
  }

  static override getQuestionType(): string {
    return 'true_or_false';
  }
}
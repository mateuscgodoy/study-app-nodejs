import { QuestionDBM, QuestionObj } from '../lib/questionTypes';
import BaseQuestion from './BaseQuestion';

export default class SingleAnswerQuestion extends BaseQuestion<string> {
  protected text: string;
  protected correctAnswer: string;
  protected createdAt: Date;
  private otherAlternatives: string[];

  constructor(
    text: string,
    correctAnswer: string,
    otherAlternatives: string[],
    createdAt?: Date
  ) {
    super();
    this.text = text;
    this.correctAnswer = correctAnswer;
    this.otherAlternatives = otherAlternatives;
    this.createdAt = createdAt ?? new Date();
  }

  getDisplayQuestion(): QuestionObj {
    const alternatives = [this.correctAnswer, ...this.otherAlternatives];
    for (let i = alternatives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
    }
    return {
      text: this.text,
      instruction: this.getInstruction(),
      alternatives,
    };
  }
  checkAnswer(answer: string): boolean {
    return (
      this.correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase()
    );
  }
  serialize(): QuestionDBM {
    return {
      text: this.text,
      correctAnswer: this.correctAnswer,
      created_at: this.createdAt.toISOString(),
      question_type: SingleAnswerQuestion.getQuestionType(),
      otherAlternatives: this.otherAlternatives,
    };
  }
  getInstruction(): string {
    return 'Choose one alternative from the available options.';
  }

  static override getQuestionType(): string {
    return 'single_answer';
  }
}

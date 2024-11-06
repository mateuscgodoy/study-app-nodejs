import { QuestionDBM, QuestionObj } from '../lib/questionTypes';
import BaseQuestion from './BaseQuestion';

export default class MultipleAnswersQuestion extends BaseQuestion<string[]> {
  protected text: string;
  protected correctAnswer: string[];
  protected createdAt: Date;
  private otherAlternatives: string[];

  constructor(
    text: string,
    correctAnswers: string[],
    otherAlternatives: string[],
    createdAt: Date
  ) {
    super();
    this.text = text;
    this.correctAnswer = correctAnswers;
    this.otherAlternatives = otherAlternatives;
    this.createdAt = createdAt ?? new Date();
  }

  getDisplayQuestion(): QuestionObj {
    const alternatives = [...this.correctAnswer, ...this.otherAlternatives];
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
  checkAnswer(answers: string[]): boolean {
    return (
      answers.every((answer) =>
        this.correctAnswer.some((correctAnswer) => correctAnswer === answer)
      ) && answers.length === this.correctAnswer.length
    );
  }
  serialize(): QuestionDBM {
    return {
      text: this.text,
      created_at: this.createdAt.toISOString(),
      question_type: MultipleAnswersQuestion.getQuestionType(),
      correctAnswer: this.correctAnswer,
      otherAlternatives: this.otherAlternatives,
    };
  }
  getInstruction(): string {
    return 'Choose one or more alternatives from the available options.';
  }
  static override getQuestionType(): string {
    return 'multiple_answers';
  }
}

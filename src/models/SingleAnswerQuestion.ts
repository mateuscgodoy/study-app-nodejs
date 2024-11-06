import IQuestion from '../lib/IQuestion';
import { QuestionDBM, QuestionObj } from '../lib/questionTypes';

export default class SingleAnswerQuestion implements IQuestion<string> {
  private _text: string;
  private _instruction: string;
  private _correctAnswer: string;
  private _otherAlternatives: string[];
  private _questionType: string;
  private _createdAt: Date;

  constructor(
    text: string,
    correctAnswer: string,
    otherAlternatives: string[],
    createdAt?: Date
  ) {
    this._text = text;
    this._instruction = 'Choose one alternative from the available options.';
    this._correctAnswer = correctAnswer;
    this._otherAlternatives = otherAlternatives;
    this._questionType = 'single_answer';
    this._createdAt = createdAt ?? new Date();
  }

  public get text(): string {
    return this._text;
  }

  public get questionType(): string {
    return this._questionType;
  }

  public get created_at(): Date {
    return this._createdAt;
  }

  public set text(value: string) {
    if (!value.trim().length) {
      throw new Error('Error: question text may not be empty');
    }
    this._text = value;
  }

  public get correctAnswer(): string {
    return this.correctAnswer;
  }

  getDisplayQuestion(): QuestionObj {
    const alternatives = [this._correctAnswer, ...this._otherAlternatives];
    for (let i = alternatives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
    }

    return { text: this._text, instruction: this._instruction, alternatives };
  }
  checkAnswer(answer: string): boolean {
    return (
      this._correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase()
    );
  }

  serialize(): QuestionDBM {
    return {
      text: this.text,
      correctAnswer: this.correctAnswer,
      created_at: this.created_at.toISOString(),
      question_type: this.questionType,
      otherAlternatives: this._otherAlternatives,
    };
  }
}

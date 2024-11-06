import IQuestion from '../lib/IQuestion';
import { QuestionDBM, QuestionObj } from '../lib/questionTypes';

export default class TrueOrFalseQuestion implements IQuestion<boolean> {
  private _text: string;
  private _instruction: string;
  private _correctAnswer: boolean;
  private _questionType: string;
  private _createdAt: Date;

  constructor(text: string, correctAnswer: boolean, createAt?: Date) {
    this._text = text;
    this._instruction = 'True or False.';
    this._correctAnswer = correctAnswer;
    this._questionType = 'true_or_false';
    this._createdAt = createAt ?? new Date();
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

  public set correctAnswer(value: boolean) {
    this._correctAnswer = value;
  }

  getDisplayQuestion(): QuestionObj {
    return {
      text: this._text,
      instruction: this._instruction,
      alternatives: ['True', 'False'],
    };
  }

  checkAnswer(answer: boolean): boolean {
    return answer === this._correctAnswer;
  }

  serialize(): QuestionDBM {
    return {
      correctAnswer: this._correctAnswer ? 'T' : 'F',
      created_at: this._createdAt.toISOString(),
      text: this._text,
      question_type: this._questionType,
    };
  }
}

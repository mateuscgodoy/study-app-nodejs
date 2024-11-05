import IQuestion from '../lib/IQuestion';
import { QuestionObj } from '../lib/questionTypes';

export default class TrueOrFalseQuestion implements IQuestion<boolean> {
  private _text: string;
  private _instruction: string;
  private _correctAnswer: boolean;

  constructor(text: string, correctAnswer: boolean) {
    this._text = text;
    this._instruction = 'True or False.';
    this._correctAnswer = correctAnswer;
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
}

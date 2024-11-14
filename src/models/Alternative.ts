import { AlternativeDB } from '../app.types';

export default class Alternative {
  private _text: string;
  private _isCorrect: boolean;
  private _explanation: string | undefined;

  constructor(text: string, isCorrect: boolean, explanation?: string) {
    this._text = text;
    this._isCorrect = isCorrect;
    this._explanation = explanation;
  }

  get text() {
    return this._text;
  }

  get isCorrect() {
    return this._isCorrect;
  }

  get explanation() {
    return this._explanation;
  }

  display(): string {
    return this.text;
  }

  serialize(): AlternativeDB {
    return {
      text: this.text,
      isCorrect: this.isCorrect ? 1 : 0,
      explanation: this.explanation ?? null,
    };
  }
}

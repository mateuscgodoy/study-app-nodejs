import Serializable from '../../lib/interfaces/Serializable';
import {
  AlternativeData,
  AlternativeDisplay,
} from '../../types/question.types';

export default class Alternative implements Serializable<AlternativeData> {
  private _text: string;
  private _isCorrect: boolean;
  private _explanation: string;

  constructor(text: string, isCorrect: boolean, explanation: string) {
    this._text = text;
    this._isCorrect = isCorrect;
    this._explanation = explanation;
  }

  serialize(): AlternativeData {
    throw new Error('Method not implemented.');
  }
  deserialize(value: AlternativeData): void {
    throw new Error('Method not implemented.');
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

  display(): AlternativeDisplay {
    return { text: this._text };
  }
}

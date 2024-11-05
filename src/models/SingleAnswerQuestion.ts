import IQuestion from '../lib/IQuestion';
import { QuestionObj } from '../lib/questionTypes';

export default class SingleAnswerQuestion implements IQuestion<string> {
  private _text: string;
  private _instruction: string;
  private _correctAnswer: string;
  private otherAlternatives: string[];

  constructor(
    text: string,
    correctAnswer: string,
    otherAlternatives: string[]
  ) {
    this._text = text;
    this._instruction = 'Choose one alternative from the available options.';
    this._correctAnswer = correctAnswer;
    this.otherAlternatives = otherAlternatives;
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
    const alternatives = [this._correctAnswer, ...this.otherAlternatives];
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
}

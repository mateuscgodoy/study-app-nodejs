import IQuestion from '../lib/IQuestion';
import { QuestionObj } from '../lib/questionTypes';

export default class MultipleAnswersQuestion implements IQuestion<string[]> {
  private _text: string;
  private _instruction: string;
  private _correctAnswer: string[];
  private _otherAlternatives: string[];

  constructor(
    text: string,
    correctAnswers: string[],
    otherAlternatives: string[]
  ) {
    this._text = text;
    this._correctAnswer = correctAnswers;
    this._otherAlternatives = otherAlternatives;
    this._instruction =
      'Choose one or more alternatives from the available options.';
  }

  public set text(value: string) {
    if (!value.trim().length) {
      throw new Error('Error: question text may not be empty');
    }

    this._text = value;
  }

  public set correctAnswer(value: string[]) {
    this._correctAnswer = value;
  }

  getDisplayQuestion(): QuestionObj {
    const alternatives = [...this._correctAnswer, ...this._otherAlternatives];
    for (let i = alternatives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
    }
    return { text: this._text, instruction: this._instruction, alternatives };
  }

  checkAnswer(answers: string[]): boolean {
    return (
      answers.every((answer) =>
        this._correctAnswer.some((correctAnswer) => correctAnswer === answer)
      ) && answers.length === this._correctAnswer.length
    );
  }
}

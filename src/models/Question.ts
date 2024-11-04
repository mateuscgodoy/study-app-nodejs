export type QuestionObj = {
  text: string;
  alternatives: string[];
};

export default class Question {
  private readonly _text;
  private readonly _wrongAlternatives: string[];
  private readonly _correctAlternatives: string[];

  constructor(
    text: string,
    wrongAlternatives: string[],
    correctAlternatives: string[]
  ) {
    this._text = text;
    this._wrongAlternatives = wrongAlternatives;
    this._correctAlternatives = correctAlternatives;
  }

  get text() {
    return this._text;
  }

  get wrongAlternatives() {
    return this._wrongAlternatives.slice(0);
  }

  get correctAlternatives() {
    return this._correctAlternatives.slice(0);
  }

  getDisplayQuestion(): QuestionObj {
    const alternatives = [
      ...this._correctAlternatives,
      ...this._wrongAlternatives,
    ];
    for (let i = alternatives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
    }
    return { text: this._text, alternatives };
  }

  checkAnswer(answers: string[]): boolean {
    return (
      answers.every((answer) =>
        this.correctAlternatives.some(
          (correctAnswer) => correctAnswer === answer
        )
      ) && answers.length === this.correctAlternatives.length
    );
  }
}

import { InputQuestion } from '../app.types';
import { QuestionTypes } from '../lib/questionTypes';
import Alternative from './Alternative';
import BaseQuestion from './BaseQuestion';
import InvalidArgument from './InvalidArgument';

export default class SingleAnswerQuestion extends BaseQuestion {
  constructor(data: InputQuestion) {
    super(data);
  }

  addAlternative(alternative: Alternative): void {
    let message;
    if (
      this.alternatives.some((alt) => alt.isCorrect) &&
      alternative.isCorrect
    ) {
      message = 'Single Answer Questions can have only one correct answer';
      throw new InvalidArgument(message, message);
    }
    if (this.alternatives.some((alt) => alt.text === alternative.text)) {
      message = `There is already an alternative with the same text on:${alternative.text}`;
      throw new InvalidArgument(message, message);
    }

    this.alternatives.push(alternative);
  }

  getInstruction(): string {
    return 'Choose one alternative from the available options.';
  }

  getType(): string {
    return QuestionTypes.SINGLE_ANSWER;
  }
}

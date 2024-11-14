import { InputQuestion } from '../app.types';
import { QuestionTypes } from '../lib/questionTypes';
import Alternative from './Alternative';
import BaseQuestion from './BaseQuestion';
import InvalidArgument from './InvalidArgument';

export default class TrueOrFalseQuestion extends BaseQuestion {
  constructor(data: InputQuestion) {
    super(data);
  }

  addAlternative(alternative: Alternative): void {
    let message: string;
    if (this.alternatives.length === 2) {
      message =
        'True or False questions can only have 2 alternatives at maximum';
      throw new InvalidArgument(message, message);
    }
    const lowerText = alternative.text.toLocaleLowerCase();
    if (lowerText !== 'true' && lowerText !== 'false') {
      message =
        "True or False questions can only have 'True' or 'False' as alternatives";
      throw new InvalidArgument(message, message);
    }
    if (
      this.alternatives.some((alt) => alt.isCorrect) &&
      alternative.isCorrect
    ) {
      message =
        'True or False questions must have only one correct alternative';
      throw new InvalidArgument(message, message);
    }
    if (
      this.alternatives.some((alt) => !alt.isCorrect) &&
      !alternative.isCorrect
    ) {
      message =
        'True or False questions must have at least one correct alternative';
      throw new InvalidArgument(message, message);
    }
    this.alternatives.push(alternative);
  }

  getType(): string {
    return QuestionTypes.TRUE_OR_FALSE;
  }

  getInstruction(): string {
    return 'True or False';
  }
}

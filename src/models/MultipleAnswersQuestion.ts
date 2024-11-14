import { InputQuestion, QuestionDisplay } from '../app.types';
import { QuestionTypes } from '../lib/questionTypes';
import Alternative from './Alternative';
import BaseQuestion from './BaseQuestion';

export default class MultipleAnswersQuestion extends BaseQuestion {
  constructor(data: InputQuestion) {
    super(data);
  }

  addAlternative(alternative: Alternative): void {
    this.alternatives.push(alternative);
  }
  getType(): string {
    return QuestionTypes.MULTIPLE_ANSWERS;
  }
  getInstruction(): string {
    return 'Choose one or more alternatives from the available options.';
  }
}

import adjustDateISOString from '../../lib/adjustDateISOString';
import { QuestionDBM, QuestionObj } from '../../types/question.types';
import InvalidQuestionArgument from '../errors/InvalidQuestionArgument';
import BaseQuestion from './BaseQuestion';

export default class SingleAnswerQuestion extends BaseQuestion<string> {
  private otherAlternatives: string[];

  constructor(
    text: string,
    correctAnswer: string,
    otherAlternatives: string[],
    createdAt?: Date
  ) {
    super(text, correctAnswer, createdAt);

    for (const alt of otherAlternatives) {
      if (!this.validateCorrectAnswerInput(alt)) {
        throw new InvalidQuestionArgument(
          'Question alternative input is invalid or has no characters'
        );
      }
    }

    this.otherAlternatives = otherAlternatives;
  }

  display(): QuestionObj {
    const alternatives = [this.correctAnswer, ...this.otherAlternatives];
    for (let i = alternatives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
    }
    return {
      text: this.text,
      instruction: SingleAnswerQuestion.getInstruction(),
      alternatives,
    };
  }
  checkAnswer(answer: string): boolean {
    return (
      this.correctAnswer.toLocaleLowerCase() === answer.toLocaleLowerCase()
    );
  }
  serialize(): QuestionDBM {
    return {
      text: this.text,
      correctAnswer: this.correctAnswer,
      created_at: adjustDateISOString(this.createdAt),
      question_type: SingleAnswerQuestion.getQuestionType(),
      otherAlternatives: this.otherAlternatives,
    };
  }

  validateCorrectAnswerInput(input: string): boolean {
    return input.trim().length > 0;
  }

  static override getQuestionType(): string {
    return 'single_answer';
  }
  static override getInstruction(): string {
    return 'Choose one alternative from the available options.';
  }
}

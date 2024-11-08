import adjustDateISOString from '../../lib/adjustDateISOString';
import { QuestionDBM, QuestionObj } from '../../lib/questionTypes';
import InvalidQuestionArgument from '../errors/InvalidQuestionArgument';
import BaseQuestion from './BaseQuestion';

export default class MultipleAnswersQuestion extends BaseQuestion<string[]> {
  private otherAlternatives: string[];

  constructor(
    text: string,
    correctAnswers: string[],
    otherAlternatives: string[],
    createdAt?: Date
  ) {
    super(text, correctAnswers, createdAt);
    if (!this.validateCorrectAnswerInput(otherAlternatives)) {
      throw new InvalidQuestionArgument(
        'Question alternative input is invalid or has no characters'
      );
    }
    this.otherAlternatives = otherAlternatives;
  }

  getDisplayQuestion(): QuestionObj {
    const alternatives = [...this.correctAnswer, ...this.otherAlternatives];
    for (let i = alternatives.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [alternatives[i], alternatives[j]] = [alternatives[j], alternatives[i]];
    }
    return {
      text: this.text,
      instruction: MultipleAnswersQuestion.getInstruction(),
      alternatives,
    };
  }
  checkAnswer(answers: string[]): boolean {
    return (
      answers.every((answer) =>
        this.correctAnswer.some((correctAnswer) => correctAnswer === answer)
      ) && answers.length === this.correctAnswer.length
    );
  }

  serialize(): QuestionDBM {
    return {
      text: this.text,
      created_at: adjustDateISOString(this.createdAt),
      question_type: MultipleAnswersQuestion.getQuestionType(),
      correctAnswer: this.correctAnswer,
      otherAlternatives: this.otherAlternatives,
    };
  }

  validateCorrectAnswerInput(input: string[]): boolean {
    for (const alt of input) {
      if (!(alt.trim().length > 0)) {
        return false;
      }
    }
    return true;
  }
  static override getQuestionType(): string {
    return 'multiple_answers';
  }
  static override getInstruction(): string {
    return 'Choose one or more alternatives from the available options.';
  }
}

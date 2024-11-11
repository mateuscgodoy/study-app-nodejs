import DIFFICULTY from '../lib/enums/difficulty';
import QUESTION_TYPES from '../lib/enums/questionTypes';
import InvalidArgument from '../models/errors/InvalidArgument';
import { AlternativeData, QuestionData } from '../types/question.types';

export default class ValidationService {
  validateQuestion(data: QuestionData) {
    const { text, questionType, difficulty } = data;
    if (!this.isValidText(text)) {
      throw new InvalidArgument('Question text must not be empty');
    }
    if (!Object.values(QUESTION_TYPES).includes(questionType)) {
      throw new InvalidArgument(
        'Question type must be from enum QUESTION_TYPES'
      );
    }
    if (difficulty && !Object.values(DIFFICULTY).includes(difficulty)) {
      throw new InvalidArgument('Difficulty must be from enum DIFFICULTY');
    }
    return true;
  }

  validateAlternatives(data: AlternativeData[]) {
    if (data.length < 2) {
      throw new InvalidArgument('There must be at least 2 alternatives');
    }
    for (const alternative of data) {
      const { text, explanation } = alternative;

      if (!this.isValidText(text)) {
        throw new InvalidArgument('Alternative text must not be empty');
      }
      if (explanation && !this.isValidText(explanation)) {
        throw new InvalidArgument(
          'Explanation text contains invalid characters'
        );
      }
    }
    return true;
  }

  validateTags(data: string[]) {
    for (const tag of data) {
      if (!this.isValidText(tag)) {
        throw new InvalidArgument('Tag text contains invalid characters');
      }
    }
  }

  private isValidText(text: string, maxLength?: number) {
    const trimmed = text.trim();
    return trimmed.length && (maxLength ? trimmed.length < maxLength : true);
  }
}

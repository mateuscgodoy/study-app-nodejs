//#region IMPORTS
import { assert } from 'console';
import OperationResult from './lib/interfaces/OperationResult';
import InvalidArgument from './models/errors/InvalidArgument';

import AlternativeService from './services/AlternativeService';
import DatabaseService from './services/DatabaseService';
import QuestionService from './services/QuestionService';
import TagService from './services/TagService';
import ValidationService from './services/ValidationService';

import {
  AlternativeData,
  ID,
  QuestionData,
  QuestionDisplay,
} from './types/question.types';

//#endregion

export default class Quest_ion {
  private debug: boolean;
  private databaseService: DatabaseService;
  private questionService: QuestionService;
  private alternativeService: AlternativeService;
  private tagService: TagService;
  private validationService: ValidationService;

  // Create application services here
  constructor() {
    this.debug =
      process.env.DEBUG === 'true' || process.env.NODE_ENV === 'development';
    this.databaseService = new DatabaseService(process.env.QUESTION_DB_PATH);
    this.validationService = new ValidationService();
    this.questionService = new QuestionService(this.databaseService);
    this.alternativeService = new AlternativeService(this.databaseService);
    this.tagService = new TagService(this.databaseService);
  }

  /**
   * Attempts to create a new question return an Operation Result
   * containing the new Question ID, or an friendly error message
   * @param data Question information used to create it.
   */
  createQuestion(data: {
    question: QuestionData;
    alternatives: AlternativeData[];
    tags?: string[];
  }): OperationResult<{ id: ID }> {
    const { question, alternatives, tags } = data;
    try {
      // Validate/Sanitize 'data' = Validation Layer (service)
      assert(this.validationService.validateQuestion(question));
      assert(this.validationService.validateAlternatives(alternatives));
      if (tags) {
        assert(this.validationService.validateTags(tags));
      }

      const createQuestionResult =
        this.questionService.createQuestion(question);

      const questionId = createQuestionResult.data!;

      this.alternativeService.addAlternatives(alternatives, questionId);

      if (tags) {
        this.tagService.addTags(tags, questionId);
      }

      return {
        success: true,
        message: 'Question created with success',
        data: { id: questionId },
      };
    } catch (error) {
      const err = error as Error;
      return {
        success: false,
        message: 'Failed to create question. Please try again later.',
        error: this.debug
          ? { name: err.name, message: err.message, stack: err.stack }
          : undefined,
      };
    }
  }

  readQuestion(id: number): OperationResult<QuestionDisplay> {
    throw new Error('Not implemented');
  }
}

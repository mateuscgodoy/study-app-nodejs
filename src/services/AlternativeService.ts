import OperationResult from '../lib/interfaces/OperationResult';
import { alternativeQueries as queries } from '../lib/util/questionQueries';
import { AlternativeData, AlternativeDBM, ID } from '../types/question.types';
import DatabaseService from './DatabaseService';

export default class AlternativeService {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  addAlternatives(
    alternatives: AlternativeData[],
    questionId: ID
  ): OperationResult {
    try {
      for (const data of alternatives) {
        this.db.insert(queries.insertNewAlternative, [
          data.text,
          questionId,
          data.isCorrect ? 1 : 0,
          data.explanation ?? null,
        ]);
      }
      return { success: true, message: 'Alternatives created with success' };
    } catch (error) {
      return {
        success: false,
        message: 'Alternative data is invalid',
        error: error as Error,
      };
    }
  }
}

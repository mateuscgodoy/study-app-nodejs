import DatabaseService from './DatabaseService';
import { questionQueries as queries } from '../lib/util/questionQueries';
import { ID, QuestionData, QuestionDisplay } from '../types/question.types';
import OperationResult from '../lib/interfaces/OperationResult';
import adjustDateISOString from '../lib/util/adjustDateISOString';
import DIFFICULTY from '../lib/enums/difficulty';

export default class QuestionService {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  createQuestion(data: QuestionData): OperationResult<ID> {
    try {
      const typeId = this.getQuestionTypeId(data.questionType);
      const insertResult = this.db.insert(queries.insertNewQuestion, [
        data.text,
        typeId,
        adjustDateISOString(new Date()),
        data.difficulty ?? DIFFICULTY.NONE,
      ]);
      const questionId = insertResult.data?.newId!;

      return {
        success: true,
        message: 'Create Question completed successfully.',
        data: questionId,
      };
    } catch (error) {
      throw error;
    }
  }

  readQuestion(id: number): OperationResult<Required<QuestionDisplay>> {
    // TODO Read Question
    throw new Error('Not Implemented');
    // try {
    //   const getQuestion = this.db.get<QuestionData>(
    //     queries.selectQuestionById,
    //     [id]
    //   );
    //   if (!getQuestion.success || !getQuestion.data?.id) {
    //     throw new InvalidQuery(getQuestion.message, queries.selectQuestionById);
    //   }
    //   const questionData: QuestionData = getQuestion.data!;
    //   const getAlternatives = this.db.getAll<AlternativeDBM[]>(
    //     queries.selectAlternatives,
    //     [questionData.id!]
    //   );
    //   if (!getAlternatives.success) {
    //     throw new InvalidQuery(
    //       getAlternatives.message,
    //       queries.selectAlternatives
    //     );
    //   }
    //   const alternatives: AlternativeDBM[] = getAlternatives.data!;
    //   const question = QuestionFactory.build(questionData, alternatives);

    //   return {
    //     success: true,
    //     message: `Read Question operation completed successfully.`,
    //     data: question,
    //   };
    // } catch (error) {
    //   return {
    //     success: false,
    //     message: `Read Operation failed with message:' ${
    //       (error as Error).message
    //     }'`,
    //     error: error as Error,
    //   };
    // }
  }

  // Make it public when implemented
  private updateQuestion() {
    // TODO Question Controller UPDATE method
    throw new Error('NOT IMPLEMENTED');
  }

  // Make it public when implemented
  private deleteQuestion() {
    // TODO Question Controller DELETE method
    throw new Error('NOT IMPLEMENTED');
  }

  private getQuestionTypeId(questionType: string): ID {
    try {
      const result = this.db.get<{ id: ID | null }>(
        queries.selectQuestionTypeId,
        [questionType]
      );

      let id = result.data?.id;
      if (!id) {
        const result = this.db.insert(queries.insertNewType, [questionType]);
        id = result.data?.newId;
      }

      return id!;
    } catch (error) {
      throw error;
    }
  }
}

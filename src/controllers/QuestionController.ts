import {
  AlternativeDBM,
  OperationResult,
  Question,
  QuestionDBM,
} from '../lib/questionTypes';
import DatabaseService from '../services/DatabaseService';
import { default as queries } from '../lib/questionQueries';
import BaseQuestion from '../models/questions/BaseQuestion';
import InvalidQuery from '../models/errors/InvalidQuery';
import QuestionFactory from '../lib/QuestionFactory';

export default class QuestionController {
  private db: DatabaseService;

  constructor(questionDbPath: string) {
    this.db = new DatabaseService(questionDbPath, queries.init);
  }

  createQuestion(data: QuestionDBM): OperationResult {
    try {
      const getIdResult = this.getQuestionTypeId(data.question_type);
      if (getIdResult.error) {
        throw getIdResult.error;
      }

      const insertResult = this.db.insert(queries.insertNewQuestion, [
        data.text,
        getIdResult.data!,
        data.created_at,
      ]);
      const questionId = insertResult.newId;

      if (Array.isArray(data.correctAnswer)) {
        for (const answer of data.correctAnswer) {
          this.db.insert(queries.insertNewAlternative, [answer, questionId, 1]);
        }
      } else {
        this.db.insert(queries.insertNewAlternative, [
          data.correctAnswer,
          questionId,
          0,
        ]);
      }

      if (data.otherAlternatives) {
        for (const answer of data.otherAlternatives) {
          this.db.insert(queries.insertNewAlternative, [answer, questionId, 0]);
        }
      }

      return {
        success: true,
        message: 'Create Question completed successfully.',
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        message: `Create Question failed with message: '${
          (error as Error).message
        }'`,
      };
    }
  }

  readQuestion(id: number): OperationResult<BaseQuestion<unknown>> {
    try {
      const getQuestion = this.db.get<Question>(queries.selectQuestionById, [
        id,
      ]);
      if (!getQuestion.success || !getQuestion.data?.id) {
        throw new InvalidQuery(getQuestion.message, queries.selectQuestionById);
      }
      const questionData: Question = getQuestion.data!;

      const getAlternatives = this.db.getAll<AlternativeDBM[]>(
        queries.selectAlternatives,
        [questionData.id!]
      );
      if (!getAlternatives.success) {
        throw new InvalidQuery(
          getAlternatives.message,
          queries.selectAlternatives
        );
      }
      const alternatives: AlternativeDBM[] = getAlternatives.data!;
      const question = QuestionFactory.build(questionData, alternatives);

      return {
        success: true,
        message: `Read Question operation completed successfully.`,
        data: question,
      };
    } catch (error) {
      return {
        success: false,
        message: `Read Operation failed with message:' ${
          (error as Error).message
        }'`,
        error: error as Error,
      };
    }
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

  private getQuestionTypeId(name: string): OperationResult<number> {
    try {
      const result = this.db.get<{ id: number | null }>(
        queries.selectQuestionTypeId,
        [name]
      );
      let id = result.data?.id;
      if (!id) {
        const result = this.db.insert(queries.insertNewType, [name]);
        id = result.newId;
      }

      return {
        success: true,
        message: 'Question Type ID completed successfully',
        data: id,
      };
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        message: 'Question Type ID operation failed',
      };
    }
  }

  // loadQuestion(id: number): OperationResult<BaseQuestion<unknown>> {
  //   // Does a question with the provided ID exists on DB? (Don't forget to JOIN with the question_type)
  //   const question = this.instance
  //     .prepare(
  //       'SELECT q.id, q.text, q.created_at, t.name as question_type FROM questions q INNER JOIN question_types t ON q.question_type_id = t.id WHERE q.id = ?;'
  //     )
  //     .get(id) as Question;

  //   if (!question.id) {
  //     return {
  //       success: false,
  //       message: 'A question with the provided ID was not found',
  //     };
  //   }

  //   const alternatives = this.instance
  //     .prepare('SELECT * FROM alternatives WHERE question_id = ?;')
  //     .all(question.id) as AlternativeDBM[];

  //   // Pass all that information to a "QuestionFactory" that will correctly create the proper question
  //   const questionInstance = QuestionFactory.build(question, alternatives);
  //   return {
  //     success: true,
  //     message: 'Question loaded with success',
  //     data: questionInstance,
  //   };
  // }
}

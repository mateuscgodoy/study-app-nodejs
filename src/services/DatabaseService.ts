import { DatabaseSync } from 'node:sqlite';

import createQuestionsQuery from '../lib/createDatabaseQuery';
import {
  AlternativeDBM,
  OperationResult,
  Question,
} from '../lib/questionTypes';
import QuestionFactory from '../lib/QuestionFactory';
import BaseQuestion from '../models/BaseQuestion';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:') {
    this.instance = new DatabaseSync(dbPath);
    this.instance.exec(createQuestionsQuery);
  }

  saveQuestion(question: BaseQuestion<any>): OperationResult {
    try {
      const data = question.serialize();
      console.log(data);
      const getQuestionType = this.instance.prepare(
        'SELECT id FROM question_types WHERE name = ?;'
      );

      let { id } = getQuestionType.get(data.question_type) as {
        id: number | null;
      };

      if (!id) {
        const { lastInsertRowid } = this.instance
          .prepare('INSERT INTO question_types (name) VALUES (?);')
          .run(data.question_type);
        id = lastInsertRowid as number;
      }

      const { lastInsertRowid: questionId } = this.instance
        .prepare(
          'INSERT INTO questions (text, question_type_id, created_at) VALUES (?, ?, ?);'
        )
        .run(data.text, id, data.created_at);

      if (Array.isArray(data.correctAnswer)) {
        for (const answer of data.correctAnswer) {
          this.insertAlternative({
            text: answer,
            question_id: questionId as number,
            is_correct: 1,
          });
        }
      } else {
        this.insertAlternative({
          text: data.correctAnswer,
          question_id: questionId as number,
          is_correct: 1,
        });
      }

      if (data.otherAlternatives) {
        for (const other of data.otherAlternatives) {
          this.insertAlternative({
            text: other,
            question_id: questionId as number,
            is_correct: 0,
          });
        }
      }
    } catch (error) {
      return {
        success: false,
        error: error as Error,
        message: 'Save operation failed',
      };
    }
    return { success: true, message: 'Question saved with success' };
  }

  loadQuestion(id: number): OperationResult<BaseQuestion<unknown>> {
    // Does a question with the provided ID exists on DB? (Don't forget to JOIN with the question_type)
    const question = this.instance
      .prepare(
        'SELECT q.id, q.text, q.created_at, t.name as question_type FROM questions q INNER JOIN question_types t ON q.question_type_id = t.id WHERE q.id = ?;'
      )
      .get(id) as Question;

    if (!question.id) {
      return {
        success: false,
        message: 'A question with the provided ID was not found',
      };
    }

    const alternatives = this.instance
      .prepare('SELECT * FROM alternatives WHERE question_id = ?;')
      .all(question.id) as AlternativeDBM[];

    // Pass all that information to a "QuestionFactory" that will correctly create the proper question
    const questionInstance = QuestionFactory.build(question, alternatives);
    return {
      success: true,
      message: 'Question loaded with success',
      data: questionInstance,
    };
  }

  private insertAlternative(alternative: AlternativeDBM) {
    this.instance
      .prepare(
        'INSERT INTO alternatives (text, question_id, is_correct) VALUES (?,?,?);'
      )
      .run(alternative.text, alternative.question_id, alternative.is_correct);
  }
}

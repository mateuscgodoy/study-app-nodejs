import { DatabaseSync } from 'node:sqlite';

import createQuestionsQuery from '../lib/createDatabaseQuery';
import {
  AlternativeDBM,
  OperationResult,
  QuestionDBM,
} from '../lib/questionTypes';
import IQuestion from '../lib/IQuestion';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:') {
    this.instance = new DatabaseSync(dbPath);
    this.instance.exec(createQuestionsQuery);
  }

  saveQuestion(question: IQuestion<any>): OperationResult {
    try {
      const data = question.serialize();

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
    return { success: true, message: 'Question was successfully saved' };
  }

  loadQuestion(id: number) {
    // TODO Database Load Question
  }

  private insertAlternative(alternative: AlternativeDBM) {
    this.instance
      .prepare(
        'INSERT INTO alternatives (text, question_id, is_correct) VALUES (?,?,?);'
      )
      .run(alternative.text, alternative.question_id, alternative.is_correct);
  }
}

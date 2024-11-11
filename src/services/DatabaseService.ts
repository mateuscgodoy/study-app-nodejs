import { DatabaseSync, SupportedValueType } from 'node:sqlite';

import InvalidQuery from '../models/errors/InvalidQuery';
import OperationResult from '../lib/interfaces/OperationResult';
import { initQuestionDatabase } from '../lib/util/questionQueries';
import { ID } from '../types/question.types';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:') {
    this.instance = new DatabaseSync(dbPath);
    this.instance.exec(initQuestionDatabase);
  }

  get<T>(query: string, params: SupportedValueType[] = []): OperationResult<T> {
    try {
      const result = this.instance.prepare(query).get(...params);

      if (!result) {
        throw new InvalidQuery('Invalid GET query provided', query);
      }
      return {
        success: true,
        message: 'GET query completed',
        data: result as T,
      };
    } catch (error) {
      throw error;
    }
  }

  getAll<T>(
    query: string,
    params: SupportedValueType[] = []
  ): OperationResult<T> {
    try {
      const result = this.instance.prepare(query).all(...params);
      return {
        success: true,
        message: 'GET ALL query completed',
        data: result as T,
      };
    } catch (error) {
      throw error;
    }
  }

  insert(
    query: string,
    params: SupportedValueType[] = []
  ): OperationResult<{ newId: ID; changes: ID }> {
    try {
      const statement = this.instance.prepare(query);
      const { changes, lastInsertRowid } = statement.run(...params);
      return {
        success: true,
        message: 'INSERT query completed',
        data: { newId: lastInsertRowid, changes: changes },
      };
    } catch (error) {
      throw error;
    }
  }

  update() {
    // TODO Database Service UPDATE method
  }

  delete() {
    // TODO Database Service DELETE method
  }
}

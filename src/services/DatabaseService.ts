import { DatabaseSync, SupportedValueType } from 'node:sqlite';

import { OperationResult } from '../lib/questionTypes';
import InvalidQuery from '../models/errors/InvalidQuery';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:', starterQuery?: string) {
    this.instance = new DatabaseSync(dbPath);
    if (starterQuery) {
      this.instance.exec(starterQuery);
    }
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
      return {
        success: false,
        message: `GET operation failed with message: '${
          (error as Error).message
        }'`,
        error: error as Error,
      };
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
      return {
        success: false,
        message: `INSERT operation failed with message: '${
          (error as Error).message
        }'`,
        error: error as Error,
      };
    }
  }

  insert(
    query: string,
    params: SupportedValueType[] = []
  ): OperationResult<{ newId: number; changes: number }> {
    try {
      const statement = this.instance.prepare(query);
      const { changes, lastInsertRowid } = statement.run(...params);
      return {
        success: true,
        message: 'INSERT query completed',
        data: { newId: lastInsertRowid as number, changes: changes as number },
      };
    } catch (error) {
      return {
        success: false,
        message: `INSERT operation failed with message: '${
          (error as Error).message
        }'`,
        error: error as Error,
      };
    }
  }

  update() {
    // TODO Database Service UPDATE method
  }

  delete() {
    // TODO Database Service DELETE method
  }
}

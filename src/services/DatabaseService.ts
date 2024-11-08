import { DatabaseSync, SupportedValueType } from 'node:sqlite';

import { AlternativeDBM, OperationResult } from '../lib/questionTypes';
import InvalidQuery from '../models/errors/InvalidQuery';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:', starterQuery?: string) {
    this.instance = new DatabaseSync(dbPath);
    if (starterQuery) {
      this.instance.exec(starterQuery);
    }
  }

  get<T>(query: string, params: SupportedValueType[]): OperationResult<T> {
    const result = this.instance.prepare(query).get(...params);
    if (!result) {
      throw new InvalidQuery('Invalid GET query provided', query);
    }
    return {
      success: true,
      message: 'GET query completed',
      data: result as T,
    };
  }

  getAll<T>(query: string, params: SupportedValueType[]): OperationResult<T> {
    const result = this.instance.prepare(query).all(...params);
    return {
      success: true,
      message: 'GET ALL query completed',
      data: result as T,
    };
  }

  insert(query: string, params: SupportedValueType[]) {
    const statement = this.instance.prepare(query);
    const { changes, lastInsertRowid } = statement.run(...params);
    return { newId: lastInsertRowid as number, changes };
  }

  update() {
    // TODO Database Service UPDATE method
  }

  delete() {
    // TODO Database Service DELETE method
  }
}

import { DatabaseSync, SupportedValueType } from 'node:sqlite';

import InvalidArgument from '../models/InvalidArgument';
import { ID } from '../app.types';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:', initQuery: string) {
    this.instance = new DatabaseSync(dbPath);
    this.instance.exec(initQuery);
  }

  get<T>(query: string, params: SupportedValueType[] = []): T {
    try {
      const result = this.instance.prepare(query).get(...params) as T;

      if (!result) {
        throw new InvalidArgument('Invalid GET query provided');
      }

      return result;
    } catch (error) {
      throw error;
    }
  }

  getAll<T>(query: string, params: SupportedValueType[] = []): T[] {
    try {
      const result = this.instance.prepare(query).all(...params) as T[];
      if (!result) {
        throw new InvalidArgument('Invalid GET ALL query provided');
      }
      return result;
    } catch (error) {
      throw error;
    }
  }

  insert(
    query: string,
    params: SupportedValueType[] = []
  ): { newId: ID; changes: ID } {
    try {
      const statement = this.instance.prepare(query);
      const { changes, lastInsertRowid } = statement.run(...params);
      if (!changes) {
        throw new InvalidArgument('Invalid INSERT query provided', query);
      }
      return { newId: lastInsertRowid, changes: changes };
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

import { tagQueries as queries } from '../lib/util/questionQueries';
import InvalidArgument from '../models/errors/InvalidArgument';
import { ID } from '../types/question.types';
import DatabaseService from './DatabaseService';

export default class TagService {
  private db: DatabaseService;

  constructor(db: DatabaseService) {
    this.db = db;
  }

  addTags(tags: string[], questionId: ID): void {
    try {
      for (const theme of tags) {
        const themeId = this.getThemeById(theme);
        this.db.insert(queries.insertTag, [questionId, themeId]);
      }
    } catch (error) {
      throw error;
    }
  }

  getThemeById(theme: string): ID {
    try {
      const name = theme.toLocaleLowerCase();
      const { data } = this.db.get<{ id: ID | null }>(queries.selectThemeId, [
        name,
      ]);
      let themeId: ID;
      if (!data?.id) {
        const insertResult = this.db.insert(queries.insertTheme, [name, theme]);
        themeId = insertResult.data?.newId!;
      } else {
        themeId = data.id;
      }
      return themeId;
    } catch (error) {
      throw error;
    }
  }
}

import { ID, ThemeDB } from '../app.types';
import { themeQueries as queries } from '../lib/queries';
import DatabaseService from '../services/DatabaseService';

export default class ThemeRepository {
  constructor(private db: DatabaseService) {}

  create(theme: ThemeDB): ID {
    const result = this.db.insert(queries.insertTheme, [
      theme.name,
      theme.displayName,
    ]);
    return result.newId;
  }

  read(questionID: ID) {
    const result = this.db.getAll<{ display_name: string }>(
      queries.selectDisplayNameById,
      [questionID]
    );
    return result;
  }

  getID(name: string): ID {
    let { id } = this.db.get<{ id: ID }>(queries.selectThemeIDByName, [name]);
    if (id) return id;
    return -1;
  }
}

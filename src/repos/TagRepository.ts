import { ID } from '../app.types';
import { tagQueries as queries } from '../lib/queries';
import DatabaseService from '../services/DatabaseService';

export default class TagRepository {
  constructor(private db: DatabaseService) {}

  create(themeID: ID, questionID: ID) {
    this.db.insert(queries.insertTag, [questionID, themeID]);
  }
}

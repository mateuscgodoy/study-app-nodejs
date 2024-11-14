import { ID, QuestionTypeDB } from '../app.types';
import { typeQueries as queries } from '../lib/queries';
import DatabaseService from '../services/DatabaseService';

export default class TypeRepository {
  private types: QuestionTypeDB[] = [];

  constructor(private db: DatabaseService) {
    this.types = this.getQuestionTypes();
  }

  create(name: string): ID {
    const result = this.db.insert(queries.insertNewType, [name]);
    return result.newId;
  }

  getQuestionTypes(): QuestionTypeDB[] {
    const types = this.db.getAll<QuestionTypeDB>(queries.selectAllTypes);
    return types;
  }

  getID(name: string): ID {
    const qType = this.types.find((type) => type.name === name);
    if (qType) return qType.id;
    let { id } = this.db.get<{ id: ID }>(queries.selectTypeIDByName, [name]);
    if (id) return id;
    return -1;
  }
}

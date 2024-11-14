import { AlternativeDB, ID } from '../app.types';
import { alternativeQueries as queries } from '../lib/queries';
import DatabaseService from '../services/DatabaseService';

type AlternativeByID = {
  text: string;
  is_correct: number;
  explanation: string | null;
};

export default class AlternativeRepository {
  constructor(private db: DatabaseService) {}

  create(alternativeDB: AlternativeDB, questionID: ID) {
    const { text, isCorrect, explanation } = alternativeDB;
    this.db.insert(queries.insertNewAlternative, [
      text,
      questionID,
      isCorrect,
      explanation,
    ]);
  }

  read(questionID: ID): AlternativeByID[] {
    const alternatives = this.db.getAll<AlternativeByID>(
      queries.selectAlternatives,
      [questionID]
    );
    return alternatives;
  }
}

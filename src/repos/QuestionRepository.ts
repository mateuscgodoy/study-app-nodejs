import { ID, QuestionDB } from '../app.types';
import { questionQueries as queries } from '../lib/queries';
import InvalidArgument from '../models/InvalidArgument';
import DatabaseService from '../services/DatabaseService';

type QuestionByID = {
  id: ID;
  text: string;
  created_at: string;
  difficulty: number | null;
  question_type: string;
};

export default class QuestionRepository {
  constructor(private db: DatabaseService) {}

  create(questionDB: QuestionDB, questionTypeID: ID): ID {
    const { text, createdAt, difficulty } = questionDB;
    const result = this.db.insert(queries.insertNewQuestion, [
      text,
      questionTypeID,
      createdAt,
      difficulty,
    ]);

    return result.newId;
  }

  read(questionID: ID): QuestionByID {
    const result = this.db.get<QuestionByID>(queries.selectQuestionById, [
      questionID,
    ]);
    if (!result.id) {
      throw new InvalidArgument(
        'Invalid Question ID',
        'Question not found. Verify the ID and try again'
      );
    }
    return result;
  }
}

import { DatabaseSync } from 'node:sqlite';

import createQuestionsQuery from '../lib/createDatabaseQuery';
import Question from '../models/Question';
import { AlternativeDBM, QuestionDBM } from '../lib/questionTypes';

export default class DatabaseService {
  private instance: DatabaseSync;

  constructor(dbPath: string = ':memory:') {
    this.instance = new DatabaseSync(dbPath);
    this.instance.exec(createQuestionsQuery);
  }

  saveQuestion(question: Question) {
    // Create the Question
    const questionInsert = this.instance.prepare(
      'INSERT INTO questions (text) VALUES (?);'
    );
    // Collect ID from question created
    const { lastInsertRowid } = questionInsert.run(question.text);
    // Prepare Insert statement for alternatives
    const alternativeInsert = this.instance.prepare(
      'INSERT INTO alternatives (text, question_id, is_correct) VALUES (?, ?, ?)'
    );
    // Insert correct alternatives
    for (const alternative of question.correctAlternatives) {
      alternativeInsert.run(alternative, lastInsertRowid, 1);
    }
    // Insert wrong alternatives
    for (const alternative of question.wrongAlternatives) {
      alternativeInsert.run(alternative, lastInsertRowid, 0);
    }
  }

  loadQuestion(id: number) {
    const getQuestion = this.instance.prepare(
      'SELECT * FROM questions WHERE id = ?;'
    );
    const questionObj = getQuestion.get(id) as QuestionDBM | undefined;
    if (!questionObj) {
      throw new Error('Error: there is no Question for the provided ID');
    }
    const getAlternatives = this.instance.prepare(
      'SELECT * FROM alternatives WHERE question_id = ?;'
    );
    const alternatives = getAlternatives.all(
      questionObj.id
    ) as AlternativeDBM[];
    const correctOnes = alternatives
      .filter((alt) => alt.is_correct === 1)
      .map((alt) => alt.text);
    const wrongOnes = alternatives
      .filter((alt) => alt.is_correct === 0)
      .map((alt) => alt.text);

    return new Question(questionObj.text, wrongOnes, correctOnes);
  }
}

const questionQueries: {
  [key: string]: string;
  init: string;
  selectQuestionTypeId: string;
  selectQuestionById: string;
  selectAlternatives: string;
  insertNewType: string;
  insertNewQuestion: string;
  insertNewAlternative: string;
} = {
  init: `CREATE TABLE IF NOT EXISTS question_types (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS questions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
text TEXT NOT NULL UNIQUE,
question_type_id INTEGER,
created_at TEXT,
FOREIGN KEY (question_type_id) REFERENCES question_types(id)
);
CREATE TABLE IF NOT EXISTS alternatives (
id INTEGER PRIMARY KEY AUTOINCREMENT,
question_id INTEGER,
text TEXT NOT NULL,
is_correct INTEGER NOT NULL,
FOREIGN KEY (question_id) REFERENCES questions(id)
);`,
  selectQuestionTypeId: 'SELECT id FROM question_types WHERE name = ?;',
  selectQuestionById: `SELECT q.id, q.text, q.created_at, t.name as question_type 
    FROM questions q 
    INNER JOIN question_types t ON q.question_type_id = t.id 
    WHERE q.id = ?;`,
  selectAlternatives: 'SELECT * FROM alternatives WHERE question_id = ?;',
  insertNewType: 'INSERT INTO question_types (name) VALUES (?);',
  insertNewQuestion:
    'INSERT INTO questions (text, question_type_id, created_at) VALUES (?, ?, ?);',
  insertNewAlternative:
    'INSERT INTO alternatives (text, question_id, is_correct) VALUES (?,?,?);',
};

export default questionQueries;

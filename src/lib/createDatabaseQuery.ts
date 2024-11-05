const createQuestionsQuery = `CREATE TABLE IF NOT EXISTS question_types (
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
);`;

export default createQuestionsQuery;

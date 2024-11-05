const createQuestionsQuery = `CREATE TABLE IF NOT EXISTS questions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
text TEXT NOT NULL UNIQUE,
created_at TEXT 
);
CREATE TABLE IF NOT EXISTS alternatives (
id INTEGER PRIMARY KEY AUTOINCREMENT,
question_id INTEGER,
text TEXT NOT NULL,
is_correct INTEGER NOT NULL,
FOREIGN KEY (question_id) REFERENCES questions(id)
);`;

export default createQuestionsQuery;

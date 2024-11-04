const createQuestionsQuery = `CREATE TABLE IF NOT EXISTS Questions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
text TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS Answers (
id INTEGER PRIMARY KEY AUTOINCREMENT,
question_id INTEGER,
is_correct INTEGER NOT NULL,
FOREIGN KEY (question_id) REFERENCES questions(id)
);`;

export default createQuestionsQuery;

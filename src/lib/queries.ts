export const initQuestionDatabase = `PRAGMA foreign_key = ON;
  CREATE TABLE IF NOT EXISTS question_types (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE
);
CREATE TABLE IF NOT EXISTS questions (
id INTEGER PRIMARY KEY AUTOINCREMENT,
text TEXT NOT NULL UNIQUE,
question_type_id INTEGER NOT NULL,
created_at TEXT,
difficulty INTEGER CHECK(difficulty BETWEEN 0 AND 2),
FOREIGN KEY (question_type_id) REFERENCES question_types(id)
);
CREATE TABLE IF NOT EXISTS alternatives (
id INTEGER PRIMARY KEY AUTOINCREMENT,
question_id INTEGER NOT NULL,
text TEXT NOT NULL,
is_correct INTEGER NOT NULL,
explanation TEXT,
FOREIGN KEY (question_id) REFERENCES questions(id)
);
CREATE TABLE IF NOT EXISTS themes (
id INTEGER PRIMARY KEY AUTOINCREMENT,
name TEXT NOT NULL UNIQUE,
display_name TEXT NOT NULL
);
CREATE TABLE IF NOT EXISTS tags (
id INTEGER PRIMARY KEY AUTOINCREMENT,
question_id INTEGER NOT NULL,
theme_id INTEGER NOT NULL,
FOREIGN KEY (question_id) REFERENCES questions(id),
FOREIGN KEY (theme_id) REFERENCES themes(id),
UNIQUE(question_id, theme_id)
);`;

export const questionQueries: {
  [key: string]: string;
  selectQuestionTypeId: string;
  selectQuestionById: string;
  insertNewQuestion: string;
} = {
  selectQuestionTypeId: 'SELECT id FROM question_types WHERE name = ?;',
  selectQuestionById: `SELECT q.id, q.text, q.created_at, q.difficulty, t.name as question_type 
    FROM questions q 
    INNER JOIN question_types t ON q.question_type_id = t.id 
    WHERE q.id = ?;`,
  insertNewQuestion:
    'INSERT INTO questions (text, question_type_id, created_at, difficulty) VALUES (?, ?, ?, ?);',
};

export const typeQueries: {
  [key: string]: string;
  selectAllTypes: string;
  selectTypeIDByName: string;
  insertNewType: string;
} = {
  selectTypeIDByName: 'SELECT id FROM question_types WHERE name = ?;',
  selectAllTypes: 'SELECT * FROM question_types;',
  insertNewType: 'INSERT INTO question_types (name) VALUES (?);',
};

export const alternativeQueries: {
  [key: string]: string;
  insertNewAlternative: string;
  selectAlternatives: string;
} = {
  insertNewAlternative:
    'INSERT INTO alternatives (text, question_id, is_correct, explanation) VALUES (?,?,?,?);',
  selectAlternatives:
    'SELECT a.text, a.is_correct, a.explanation FROM alternatives a WHERE question_id = ?;',
};

export const tagQueries: {
  [key: string]: string;
  insertTag: string;
} = {
  insertTag: 'INSERT INTO tags (question_id, theme_id) VALUES (?, ?);',
};

export const themeQueries: {
  [key: string]: string;
  selectThemeIDByName: string;
  selectDisplayNameById: string;
  insertTheme: string;
} = {
  selectThemeIDByName: 'SELECT id FROM themes WHERE name = ?;',
  selectDisplayNameById:
    'SELECT display_name FROM themes INNER JOIN tags ON themes.id = tags.theme_id WHERE question_id = ?;',
  insertTheme: 'INSERT INTO themes (name, display_name) VALUES (?, ?);',
};

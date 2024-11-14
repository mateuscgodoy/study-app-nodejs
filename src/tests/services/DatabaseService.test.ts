import assert from 'assert/strict';
import { beforeEach, describe, it } from 'node:test';
import DatabaseService from '../../services/DatabaseService';

const createTestTable = `CREATE TABLE IF NOT EXISTS notes(
id INTEGER PRIMARY KEY AUTOINCREMENT,
content TEXT NOT NULL);
INSERT INTO notes (content) VALUES ("Testing note 1");
INSERT INTO notes (content) VALUES ("Testing note 2");
INSERT INTO notes (content) VALUES ("Testing note 3");`;

type Note = {
  id?: number;
  content: string;
};

describe('DatabaseService', () => {
  it('correct creates a database in memory', () => {
    const db = new DatabaseService(':memory:', createTestTable);
    assert(db);
  });

  describe('class methods', () => {
    let db: DatabaseService;

    beforeEach(() => {
      db = new DatabaseService(':memory:', createTestTable);
    });

    describe('GET method', () => {
      it('correctly GET a single Note from testing table', () => {
        const note = db.get<Note>('SELECT * FROM notes WHERE id = ?', [1]);

        assert.ok(note);
        assert.equal(note.content, 'Testing note 1');
      });

      it('returns a generic object even without the necessary parameters', () => {
        const note = db.get<Note>('SELECT * FROM notes WHERE id = ?', []);

        assert.ok(note);
        assert.equal(note.id, null);
        assert.equal(note.content, null);
      });

      it('returns a generic object even with invalid parameters', () => {
        const note = db.get<Note>('SELECT * FROM notes WHERE id = ?', [
          'invalid',
        ]);

        assert.ok(note);
        assert.equal(note.id, null);
        assert.equal(note.content, null);
      });

      it('throws when trying to GET tables that do not exist', () => {
        assert.throws(() => {
          const note = db.get<Note>('SELECT * FROM invalid', []);
        });
      });

      it('throws when improper number of arguments ', () => {
        assert.throws(() => {
          const note = db.get<Note>('SELECT * FROM notes WHERE id = ?', [
            'invalid',
            1,
          ]);
        });
      });
    });

    describe('GET ALL method', () => {
      it('correctly GET ALL notes as an array', () => {
        const notes = db.getAll<Note>('SELECT * FROM notes');

        assert(notes);
        assert(notes.length === 3);
        assert(Array.isArray(notes));
      });

      it('throws when trying to GET ALL tables that do not exist', () => {
        assert.throws(() => {
          const note = db.getAll<Note>('SELECT * FROM invalid', []);
        });
      });

      it('throws when improper number of arguments ', () => {
        assert.throws(() => {
          const note = db.getAll<Note>('SELECT * FROM notes WHERE id = ?', [
            'invalid',
            1,
          ]);
        });
      });
    });

    describe('INSERT method', () => {
      it('correctly INSERT new Notes to testing table', () => {
        const result = db.insert('INSERT INTO notes (content) VALUES (?)', [
          'A testing note',
        ]);

        assert(result);
        assert.ok(result.newId > 3);
        assert.equal(result.changes, 1);
      });

      it('throws when trying to INSERT tables that do not exist', () => {
        assert.throws(() => {
          const result = db.insert(
            'INSERT INTO invalid (content) VALUES (?)',
            []
          );
        });
      });

      it('throws when improper number of arguments ', () => {
        assert.throws(() => {
          const result = db.insert('INSERT INTO notes (content) VALUES (?)', [
            1,
            'should be invalid',
          ]);
        });
      });
    });
  });
});

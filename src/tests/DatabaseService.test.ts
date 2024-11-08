import assert from 'assert';
import { beforeEach, describe, it } from 'node:test';
import DatabaseService from '../services/DatabaseService';

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
        const result = db.get<Note>('SELECT * FROM notes WHERE id = ?', [1]);
        const note = result.data;

        assert.ok(result.success);
        assert.ok(note);
        assert.equal(note.content, 'Testing note 1');
      });

      it('returns a generic object even without the necessary parameters', () => {
        const result = db.get<Note>('SELECT * FROM notes WHERE id = ?', []);

        assert.ok(result.success);
        assert.ok(result.data);
        assert.equal(result.data.id, null);
        assert.equal(result.data.content, null);
      });

      it('returns a generic object even with invalid parameters', () => {
        const result = db.get<Note>('SELECT * FROM notes WHERE id = ?', [
          'invalid',
        ]);

        assert.ok(result.success);
        assert.ok(result.data);
        assert.equal(result.data.id, null);
        assert.equal(result.data.content, null);
      });

      it('throws when trying to GET tables that do not exist', () => {
        const result = db.get<Note>('SELECT * FROM invalid', []);

        assert.equal(result.success, false);
        assert.equal(
          result.message,
          "GET operation failed with message: 'no such table: invalid'"
        );
      });

      it('throws when improper number of arguments ', () => {
        const result = db.get<Note>('SELECT * FROM notes WHERE id = ?', [
          'invalid',
          1,
        ]);

        assert.equal(result.success, false);
        assert.equal(
          result.message,
          "GET operation failed with message: 'column index out of range'"
        );
      });
    });

    describe('GET ALL method', () => {
      it('correctly GET an array of all elements', () => {
        const result = db.getAll<Note[]>('SELECT * FROM notes');

        console.log(result);
        const data = result.data;
        assert(result.success);
        assert(data);
        assert(data.length === 3);
      });
    });

    describe('INSERT method', () => {
      it('correctly INSERT new Notes to testing table', () => {
        const result = db.insert('INSERT INTO notes (content) VALUES (?)', [
          'A testing note',
        ]);

        const data = result.data;
        assert(data);
        assert.ok(data.newId > 3);
        assert.equal(data.changes, 1);
      });

      it('throws when trying to INSERT tables that do not exist', () => {
        const result = db.insert(
          'INSERT INTO invalid (content) VALUES (?)',
          []
        );

        assert.equal(result.success, false);
        assert.equal(
          result.message,
          "INSERT operation failed with message: 'no such table: invalid'"
        );
      });

      it('throws when improper number of arguments ', () => {
        const result = db.insert('INSERT INTO notes (content) VALUES (?)', [
          1,
          'should be invalid',
        ]);

        assert.equal(result.success, false);
        assert.equal(
          result.message,
          "INSERT operation failed with message: 'column index out of range'"
        );
      });
    });
  });
});

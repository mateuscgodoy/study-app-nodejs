import assert from 'assert';
import DatabaseService from './services/DatabaseService';

console.log();

const db = new DatabaseService('./questions.db');

assert(db);

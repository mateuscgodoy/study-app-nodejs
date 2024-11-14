import { ID, SerializedQuestion } from './app.types';
import IOperationResult from './lib/IOperationResult';
import BaseQuestion from './models/BaseQuestion';
import AlternativeRepository from './repos/AlternativeRepository';
import QuestionRepository from './repos/QuestionRepository';
import TagRepository from './repos/TagRepository';
import ThemeRepository from './repos/ThemeRepository';
import TypeRepository from './repos/TypeRepository';
import DatabaseService from './services/DatabaseService';
import QuestionService from './services/QuestionService';
import { initQuestionDatabase } from './lib/queries';

export default class QuestionManager {
  private db: DatabaseService;
  private questionRepo: QuestionRepository;
  private alternativeRepo: AlternativeRepository;
  private themeRepo: ThemeRepository;
  private typeRepo: TypeRepository;
  private tagRepo: TagRepository;
  private questionService: QuestionService;
  private debug: boolean;
  constructor() {
    this.debug =
      process.env.DEBUG === 'true' && process.env.NODE_ENV === 'development';
    this.db = new DatabaseService(
      process.env.QUESTION_DB_PATH,
      initQuestionDatabase
    );
    this.questionRepo = new QuestionRepository(this.db);
    this.alternativeRepo = new AlternativeRepository(this.db);
    this.themeRepo = new ThemeRepository(this.db);
    this.tagRepo = new TagRepository(this.db);
    this.typeRepo = new TypeRepository(this.db);
    this.questionService = new QuestionService(
      this.questionRepo,
      this.alternativeRepo,
      this.tagRepo,
      this.typeRepo,
      this.themeRepo
    );
  }

  /**
   * Attempts to save a question data into the database, returning the new ID.
   * @param data Serialized question data
   * @returns An IOperationResult with the resulting ID or an error message.
   */
  save(data: SerializedQuestion): IOperationResult<ID> {
    let output: IOperationResult<ID> = {
      message: 'Save Operation completed successfully',
    };
    try {
      // Future data validation
      let id = data.question.id;
      if (id) {
        output.message = 'Updating the question records on Database';
        // Future call to UPDATE
        return output;
      }
      id = this.questionService.save(data);
      output.data = id;
    } catch (error) {
      if (this.debug) {
        output.error = error as Error;
      }
      output.message =
        'Question could not be saved. Check information and try again';
    } finally {
      return output;
    }
  }

  /**
   * Attempts to load a question from the database generating a regenerated
   * instance of BaseQuestion.
   * @param questionID The question ID to load
   * @returns An instance of BaseQuestion or an error message
   */
  load(questionID: ID): IOperationResult<BaseQuestion> {
    let output: IOperationResult<BaseQuestion> = {
      message: 'Load operation completed successfully',
    };
    try {
      // Future Data validation
      const question = this.questionService.load(questionID);

      output.data = question;
    } catch (error) {
      if (this.debug) {
        output.error = error as Error;
      }
      output.message = 'Question not found. Verify the ID and try again';
    } finally {
      return output;
    }
  }

  /**
   * Attempts to answer a question using only the question ID and the answer,
   * which can also be an array of answers for questions that have many answers
   * @param questionID The question ID to verify
   * @param answer A boolean expressing the result or an error message if something goes wrong.
   */
  answerQuestion(
    questionID: ID,
    answer: string | string[]
  ): IOperationResult<boolean> {
    // TODO Answer question
    throw new Error('NOT IMPLEMENTED');
  }
}

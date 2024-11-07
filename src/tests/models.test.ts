import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert';

import BaseQuestion from '../models/questions/BaseQuestion';
import TrueOrFalseQuestion from '../models/questions/TrueOrFalseQuestion';
import SingleAnswerQuestion from '../models/questions/SingleAnswerQuestion';
import MultipleAnswersQuestion from '../models/questions/MultipleAnswersQuestion';
import { QuestionDBM, QuestionObj } from '../lib/questionTypes';
import InvalidQuestionArgument from '../models/errors/InvalidQuestionArgument';

describe('Question models test suit', () => {
  describe('BaseClass', () => {
    it("returns 'Not defined' from static getType() method", () => {
      const baseType = BaseQuestion.getQuestionType();
      assert.equal(baseType, 'Not defined');
    });
  });

  describe('TrueOrFalseQuestion', () => {
    it('instantiates correctly', () => {
      const question = new TrueOrFalseQuestion(
        'Some true or false question',
        true,
        new Date()
      );

      assert(question);
    });

    it('overwrites getQuestionType and returns "true_or_false"', () => {
      const questionType = TrueOrFalseQuestion.getQuestionType();

      assert.equal(questionType, 'true_or_false');
    });

    it('throws InvalidQuestionArgument error if an empty string is passed as text', () => {
      assert.throws(
        () => {
          const question = new TrueOrFalseQuestion('', true);
        },
        InvalidQuestionArgument,
        'Question text must not be empty'
      );
    });

    it('throws InvalidQuestionArgument error if text is composed of whitespace only', () => {
      assert.throws(
        () => {
          const question = new TrueOrFalseQuestion('      ', true);
        },
        InvalidQuestionArgument,
        'Question text must not be empty'
      );
    });

    it('throws InvalidQuestionArgument error if createdAt data is in the future', () => {
      const invalidDate = new Date(Date.now() * 10);
      assert.throws(
        () => {
          const question = new TrueOrFalseQuestion(
            'Some text',
            true,
            invalidDate
          );
        },
        InvalidQuestionArgument,
        'Creation date may not be in the future'
      );
    });

    describe('', () => {
      let trueOrFalseQuestion: TrueOrFalseQuestion;
      const createdAt = new Date();
      beforeEach(() => {
        trueOrFalseQuestion = new TrueOrFalseQuestion(
          'Some true or false question',
          true,
          createdAt
        );
      });

      it('correctly checks answers', () => {
        assert.equal(true, trueOrFalseQuestion.checkAnswer(true));
      });

      it('correctly serializes questions', () => {
        const mock: QuestionDBM = {
          text: 'Some true or false question',
          correctAnswer: 'T',
          created_at: createdAt.toISOString(),
          question_type: TrueOrFalseQuestion.getQuestionType(),
        };
        const serialized = trueOrFalseQuestion.serialize();
        assert.deepStrictEqual(serialized, mock);
      });

      it('correctly overrides getInstruction static method', () => {
        const instruction = TrueOrFalseQuestion.getInstruction();
        assert.equal(instruction, 'True or False');
      });

      it('correctly return a safe to display question version', () => {
        const mock: QuestionObj = {
          text: 'Some true or false question',
          alternatives: ['True', 'False'],
          instruction: TrueOrFalseQuestion.getInstruction(),
        };
        const displayQuestion = trueOrFalseQuestion.getDisplayQuestion();
        assert.deepEqual(displayQuestion, mock);
      });
    });
  });

  describe('SingleAnswerQuestion', () => {
    it('instantiates correctly', () => {
      const question = new SingleAnswerQuestion(
        'Some single answer question',
        'Answer',
        ['Other alternative', 'Other alternative 2', 'Other alternative 3'],
        new Date()
      );
      assert(question);
    });

    it('overwrites getQuestionType and returns "single_answer"', () => {
      const questionType = SingleAnswerQuestion.getQuestionType();
      assert.equal(questionType, 'single_answer');
    });

    it('overwrites getInstruction static method correct', () => {
      const singleInstruction = SingleAnswerQuestion.getInstruction();
      assert.equal(
        singleInstruction,
        'Choose one alternative from the available options.'
      );
    });

    it('throws InvalidQuestionArgument when the correct answer is an empty string', () => {
      assert.throws(
        () => {
          const question = new SingleAnswerQuestion('Some text', '', ['valid']);
        },
        InvalidQuestionArgument,
        'The correct answer input provided is invalid'
      );
    });

    it('throws InvalidQuestionArgument when the correct answer only has whitespace characters', () => {
      assert.throws(
        () => {
          const question = new SingleAnswerQuestion('Some text', '          ', [
            'valid',
          ]);
        },
        InvalidQuestionArgument,
        'The correct answer input provided is invalid'
      );
    });

    it('throws InvalidQuestionArgument when one of the other alternatives is empty', () => {
      assert.throws(
        () => {
          const question = new SingleAnswerQuestion(
            'Some text',
            'valid answer',
            ['', "I'm valid"]
          );
        },
        InvalidQuestionArgument,
        'Question alternative input is invalid or has no characters'
      );
    });

    describe('', () => {
      let singleAnswerQuestion: SingleAnswerQuestion;
      const createdAt = new Date();
      beforeEach(() => {
        singleAnswerQuestion = new SingleAnswerQuestion(
          'Some true or false question',
          'a valid answer',
          ['other alternative 1', 'other alternative 2'],
          createdAt
        );
      });

      it('correctly checks answers', () => {
        assert.equal(true, singleAnswerQuestion.checkAnswer('a valid answer'));
      });

      it('correctly serializes questions', () => {
        const mock: QuestionDBM = {
          text: 'Some true or false question',
          correctAnswer: 'a valid answer',
          created_at: createdAt.toISOString(),
          question_type: SingleAnswerQuestion.getQuestionType(),
          otherAlternatives: ['other alternative 1', 'other alternative 2'],
        };
        const serialized = singleAnswerQuestion.serialize();
        assert.deepStrictEqual(serialized, mock);
      });

      it('correctly overrides getInstruction static method', () => {
        const instruction = SingleAnswerQuestion.getInstruction();
        assert.equal(
          instruction,
          'Choose one alternative from the available options.'
        );
      });

      it('correctly return a safe to display question version', () => {
        const displayQuestion = singleAnswerQuestion.getDisplayQuestion();
        const mock: QuestionObj = {
          text: 'Some true or false question',
          alternatives: displayQuestion.alternatives,
          instruction: SingleAnswerQuestion.getInstruction(),
        };
        assert.deepEqual(displayQuestion, mock);
      });
    });
  });

  describe('MultipleAnswersQuestion', () => {
    it('instantiates correctly', () => {
      const question = new MultipleAnswersQuestion(
        'My question text',
        ['Correct answer 1', 'correct answer 2'],
        ['other answer 1', 'other answer 2', 'other answer 3'],
        new Date()
      );
      assert(question);
    });

    it('overwrites getQuestionType and returns "multiple_answers"', () => {
      const questionType = MultipleAnswersQuestion.getQuestionType();
      assert.equal(questionType, 'multiple_answers');
    });

    it('overwrites getInstruction static method correctly', () => {
      const multipleInstruction = MultipleAnswersQuestion.getInstruction();
      assert.equal(
        multipleInstruction,
        'Choose one or more alternatives from the available options.'
      );
    });

    it('throws InvalidQuestionArgument when the correct answer is an empty string', () => {
      assert.throws(
        () => {
          const question = new MultipleAnswersQuestion(
            'My question text',
            ['', 'correct answer 2'],
            ['other answer 1', 'other answer 2', 'other answer 3'],
            new Date()
          );
        },
        InvalidQuestionArgument,
        'The correct answer input provided is invalid'
      );
    });

    it('throws InvalidQuestionArgument when the correct answer only has whitespace characters', () => {
      assert.throws(
        () => {
          const question = new MultipleAnswersQuestion(
            'My question text',
            ['            ', 'correct answer 2'],
            ['other answer 1', 'other answer 2', 'other answer 3'],
            new Date()
          );
        },
        InvalidQuestionArgument,
        'The correct answer input provided is invalid'
      );
    });

    it('throws InvalidQuestionArgument when one of the other alternatives is empty', () => {
      assert.throws(
        () => {
          const question = new MultipleAnswersQuestion(
            'My question text',
            ['Correct answer 1', 'correct answer 2'],
            ['other answer 1', '', 'other answer 3'],
            new Date()
          );
        },
        InvalidQuestionArgument,
        'Question alternative input is invalid or has no characters'
      );
    });

    describe('', () => {
      let multipleAnswersQuestion: MultipleAnswersQuestion;
      const createdAt = new Date();
      beforeEach(() => {
        multipleAnswersQuestion = new MultipleAnswersQuestion(
          'Some multiple answer question',
          ['a valid answer', 'another valid answer'],
          ['other alternative 1', 'other alternative 2'],
          createdAt
        );
      });

      it('correctly checks answers', () => {
        assert.equal(
          true,
          multipleAnswersQuestion.checkAnswer([
            'a valid answer',
            'another valid answer',
          ])
        );
      });

      it('correctly serializes questions', () => {
        const mock: QuestionDBM = {
          text: 'Some multiple answer question',
          correctAnswer: ['a valid answer', 'another valid answer'],
          created_at: createdAt.toISOString(),
          question_type: MultipleAnswersQuestion.getQuestionType(),
          otherAlternatives: ['other alternative 1', 'other alternative 2'],
        };
        const serialized = multipleAnswersQuestion.serialize();
        assert.deepStrictEqual(serialized, mock);
      });

      it('correctly overrides getInstruction static method', () => {
        const instruction = MultipleAnswersQuestion.getInstruction();
        assert.equal(
          instruction,
          'Choose one or more alternatives from the available options.'
        );
      });

      it('correctly return a safe to display question version', () => {
        const displayQuestion = multipleAnswersQuestion.getDisplayQuestion();
        const mock: QuestionObj = {
          text: 'Some multiple answer question',
          alternatives: displayQuestion.alternatives,
          instruction: MultipleAnswersQuestion.getInstruction(),
        };
        assert.deepEqual(displayQuestion, mock);
      });
    });
  });
});

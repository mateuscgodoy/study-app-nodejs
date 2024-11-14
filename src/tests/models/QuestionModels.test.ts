import { beforeEach, describe, it } from 'node:test';
import assert from 'node:assert/strict';
import TrueOrFalseQuestion from '../../models/TrueOrFalseQuestion';
import { Difficulties } from '../../lib/difficulties';
import { QuestionTypes } from '../../lib/questionTypes';
import Alternative from '../../models/Alternative';
import InvalidArgument from '../../models/InvalidArgument';

describe('Question Models', () => {
  describe('TrueOrFalseQuestion', () => {
    let trueOrFalse: TrueOrFalseQuestion;
    const time = new Date();
    beforeEach(() => {
      trueOrFalse = new TrueOrFalseQuestion({
        text: 'The sun is further away than the moon',
        createdAt: time,
        difficulty: Difficulties.BEGINNER,
      });
    });

    it('correctly returns the proper Question Type', () => {
      const qType = trueOrFalse.getType();
      assert.equal(qType, QuestionTypes.TRUE_OR_FALSE);
    });

    it('correctly returns the Instruction', () => {
      const instruction = trueOrFalse.getInstruction();
      assert.equal(instruction, 'True or False');
    });

    it('correctly accept two valid alternatives', () => {
      assert.doesNotThrow(() => {
        trueOrFalse.addAlternative(new Alternative('True', true));
        trueOrFalse.addAlternative(new Alternative('False', false));
      });
    });

    it('throws when adding an alternative that is not "true"/"false"', () => {
      assert.throws(
        () => {
          trueOrFalse.addAlternative(new Alternative('Something else', false));
        },
        InvalidArgument,
        "True or False questions can only have 'True' or 'False' as alternatives"
      );
    });

    it('throws when trying to add 3 alternatives', () => {
      assert.throws(
        () => {
          trueOrFalse.addAlternative(new Alternative('True', true));
          trueOrFalse.addAlternative(new Alternative('False', false));
          trueOrFalse.addAlternative(new Alternative('False', false));
        },
        InvalidArgument,
        'True or False questions can only have 2 alternatives at maximum'
      );
    });

    it('throws when trying to add two correct alternatives', () => {
      assert.throws(
        () => {
          trueOrFalse.addAlternative(new Alternative('True', true));
          trueOrFalse.addAlternative(new Alternative('False', true));
        },
        InvalidArgument,
        'True or False questions must have only one correct alternative'
      );
    });

    it('throws when there is no correct alternative', () => {
      assert.throws(
        () => {
          trueOrFalse.addAlternative(new Alternative('True', false));
          trueOrFalse.addAlternative(new Alternative('false', false));
        },
        InvalidArgument,
        'True or False questions must have at least one correct alternative'
      );
    });

    it('correctly add a new tag', () => {
      assert.doesNotThrow(() => {
        trueOrFalse.addTag('Science');
      });
    });

    it('throws when adding a tag that is already there', () => {
      assert.throws(
        () => {
          trueOrFalse.addTag('Science');
          trueOrFalse.addTag('SciEncE');
        },
        InvalidArgument,
        'This question already contains this tag'
      );
    });
  });
});

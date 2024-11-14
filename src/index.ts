import { config } from 'dotenv';
import TrueOrFalseQuestion from './models/TrueOrFalseQuestion';
import Alternative from './models/Alternative';
import { Difficulties } from './lib/difficulties';
import QuestionManager from './QuestionManager';
import SingleAnswerQuestion from './models/SingleAnswerQuestion';
import MultipleAnswersQuestion from './models/MultipleAnswersQuestion';
config();

const manager = new QuestionManager();
const multipleAnswers = new MultipleAnswersQuestion({
  text: "Which alternatives represent the primitive 'object' from JavaScript?",
  difficulty: Difficulties.INTERMEDIATE,
});
multipleAnswers.addAlternative(new Alternative('object', true, 'Correct ✅'));
multipleAnswers.addAlternative(new Alternative('string', false));
multipleAnswers.addAlternative(new Alternative('number', false));
multipleAnswers.addAlternative(new Alternative('function', true));
multipleAnswers.addAlternative(new Alternative('null', true));

const result = manager.save(multipleAnswers.serialize());

if (result.data) {
  const loadResult = manager.load(result.data);
  console.log(loadResult);

  console.log(loadResult.data?.display());
}

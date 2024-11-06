import BaseQuestion from '../models/BaseQuestion';
import MultipleAnswersQuestion from '../models/MultipleAnswersQuestion';
import SingleAnswerQuestion from '../models/SingleAnswerQuestion';
import TrueOrFalseQuestion from '../models/TrueOrFalseQuestion';
import { AlternativeDBM, Question } from './questionTypes';

export default class QuestionFactory {
  static build(
    question: Question,
    alternatives: AlternativeDBM[]
  ): BaseQuestion<unknown> {
    switch (question.question_type) {
      case TrueOrFalseQuestion.getQuestionType():
        const tfAnswer = alternatives[0].text === 'T';
        const tfCreatedAt = new Date(question.created_at);
        return new TrueOrFalseQuestion(question.text, tfAnswer, tfCreatedAt);

      case SingleAnswerQuestion.getQuestionType():
        const singleAnswer = alternatives.find(
          (alt) => alt.is_correct === 1
        )?.text;
        const singleOthers = alternatives
          .filter((alt) => alt.is_correct !== 1)
          .map((alt) => alt.text);
        return new SingleAnswerQuestion(
          question.text,
          singleAnswer!,
          singleOthers,
          new Date(question.created_at)
        );

      case MultipleAnswersQuestion.getQuestionType():
        const multiAnswers: { correct: string[]; wrong: string[] } = {
          correct: [],
          wrong: [],
        };
        alternatives.forEach((alt) => {
          alt.is_correct
            ? multiAnswers.correct.push(alt.text)
            : multiAnswers.wrong.push(alt.text);
        });
        return new MultipleAnswersQuestion(
          question.text,
          multiAnswers.correct,
          multiAnswers.wrong,
          new Date(question.created_at)
        );

      default:
        throw new Error('Invalid question type provided');
    }
  }
}

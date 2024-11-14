import { ID, InputQuestion, SerializedQuestion } from '../app.types';
import { QuestionTypes } from '../lib/questionTypes';
import Alternative from '../models/Alternative';
import BaseQuestion from '../models/BaseQuestion';
import InvalidArgument from '../models/InvalidArgument';
import MultipleAnswersQuestion from '../models/MultipleAnswersQuestion';
import SingleAnswerQuestion from '../models/SingleAnswerQuestion';
import TrueOrFalseQuestion from '../models/TrueOrFalseQuestion';
import AlternativeRepository from '../repos/AlternativeRepository';
import QuestionRepository from '../repos/QuestionRepository';
import TagRepository from '../repos/TagRepository';
import ThemeRepository from '../repos/ThemeRepository';
import TypeRepository from '../repos/TypeRepository';

export default class QuestionService {
  constructor(
    private questionRepo: QuestionRepository,
    private alternativeRepo: AlternativeRepository,
    private tagRepo: TagRepository,
    private typeRepo: TypeRepository,
    private themeRepo: ThemeRepository
  ) {}

  save(data: SerializedQuestion): ID {
    const { question, alternatives, tags } = data;
    let questionTypeID = this.typeRepo.getID(question.questionType);
    if (questionTypeID === -1) {
      questionTypeID = this.typeRepo.create(question.questionType);
    }
    const questionID = this.questionRepo.create(question, questionTypeID);
    for (const alt of alternatives) {
      this.alternativeRepo.create(alt, questionID);
    }
    for (const theme of tags) {
      let themeID = this.themeRepo.getID(theme.name);
      if (themeID === -1) {
        themeID = this.themeRepo.create(theme);
      }
      this.tagRepo.create(themeID, questionID);
    }
    return questionID;
  }

  load(questionID: ID): BaseQuestion {
    const questionData = this.questionRepo.read(questionID);
    const alternativesData = this.alternativeRepo.read(questionID);
    const tagsData = this.themeRepo.read(questionID);

    const question = this.createInstance(
      questionData.question_type,
      questionData as InputQuestion
    );
    for (const data of alternativesData) {
      const { text, explanation } = data;
      const isCorrect = data.is_correct === 1 ? true : false;
      const alternative = new Alternative(text, isCorrect, explanation ?? '');
      question.addAlternative(alternative);
    }
    for (const tag of tagsData) {
      question.addTag(tag.display_name);
    }
    return question;
  }

  private createInstance(
    questionType: string,
    data: InputQuestion
  ): BaseQuestion {
    switch (questionType) {
      case QuestionTypes.TRUE_OR_FALSE:
        return new TrueOrFalseQuestion(data);

      case QuestionTypes.SINGLE_ANSWER:
        return new SingleAnswerQuestion(data);

      case QuestionTypes.MULTIPLE_ANSWERS:
        return new MultipleAnswersQuestion(data);

      default:
        throw new InvalidArgument(
          `Invalid Question Type encountered: ${questionType}`
        );
    }
  }
}

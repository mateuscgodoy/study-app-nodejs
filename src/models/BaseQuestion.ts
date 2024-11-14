import {
  ID,
  InputQuestion,
  QuestionDisplay,
  SerializedQuestion,
} from '../app.types';
import convertDifficulty from '../lib/convertDifficulty';
import setDateISO from '../lib/setDateISO';
import Alternative from './Alternative';
import Theme from './Theme';

export default abstract class BaseQuestion {
  protected id: ID | undefined;
  protected text: string;
  protected createdAt: Date;
  protected difficulty: number | undefined;
  protected alternatives: Alternative[] = [];
  protected tags: Theme[] = [];

  constructor(data: InputQuestion) {
    this.id = data.id;
    this.text = data.text;
    this.createdAt = data.createdAt ?? new Date();
    this.difficulty = data.difficulty;
  }

  abstract addAlternative(alternative: Alternative): void;
  abstract getType(): string;
  abstract getInstruction(): string;

  display(): QuestionDisplay {
    return {
      text: this.text,
      instruction: this.getInstruction(),
      alternatives: this.alternatives.map((alt) => alt.text),
      createdAt: setDateISO(this.createdAt),
      tags: this.tags.map((tag) => tag.display()),
      difficulty: convertDifficulty(this.difficulty),
    };
  }

  serialize(): SerializedQuestion {
    return {
      question: {
        text: this.text,
        questionType: this.getType(),
        createdAt: setDateISO(this.createdAt),
        difficulty: this.difficulty ?? null,
      },
      alternatives: this.alternatives.map((alt) => alt.serialize()),
      tags: this.tags.map((tag) => tag.serialize()),
    };
  }

  addTag(displayName: string) {
    const theme = new Theme(displayName);
    if (this.tags.some((tag) => Theme.isEqual(theme, tag))) return;
    this.tags.push(theme);
  }
}

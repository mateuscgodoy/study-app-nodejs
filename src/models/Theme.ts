import { ThemeDB } from '../app.types';

export default class Theme {
  private _name: string;
  private _displayName: string;

  constructor(displayName: string) {
    this._name = displayName.toLocaleLowerCase();
    this._displayName = displayName;
  }

  get name(): string {
    return this._name;
  }

  get displayName(): string {
    return this._displayName;
  }

  set displayName(value: string) {
    this._displayName = value;
    this._name = value.toLocaleLowerCase();
  }

  serialize(): ThemeDB {
    return { name: this.name, displayName: this.displayName };
  }

  display(): string {
    return this.displayName;
  }

  static isEqual(themeA: Theme, themeB: Theme): boolean {
    return themeA.name === themeB.name;
  }

  static compareTo(themeA: Theme, themeB: Theme): number {
    return themeA.name.localeCompare(themeB.name);
  }
}

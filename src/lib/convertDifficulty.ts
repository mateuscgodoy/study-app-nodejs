export default function convertDifficulty(difficulty?: number): string {
  switch (difficulty) {
    case 0:
      return 'Beginner';
    case 1:
      return 'Intermediate';
    case 2:
      return 'Advanced';
    default:
      return 'Not defined';
  }
}

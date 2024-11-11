export default function adjustDateISOString(previous?: Date): string {
  let date = previous;
  if (!date) {
    date = new Date();
  }
  const offset = date.getTimezoneOffset();
  const adjusted = new Date(date.getTime() - offset * 60000);
  return adjusted.toISOString();
}

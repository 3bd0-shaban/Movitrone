export function toMinutes(seconds: number): {
  minutes: number;
  time: string;
} {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  const time = `${minutes}:${remainingSeconds}`;
  return { minutes, time };
}

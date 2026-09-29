/** "YYYY.MM" 두 개 사이의 기간을 "1년 3개월" 형태로. 시작 달과 끝 달을 모두 포함해 센다 */
export function formatDuration(start: string, end: string) {
  const [sy, sm] = start.split(".").map(Number);
  const [ey, em] = end.split(".").map(Number);
  const months = (ey - sy) * 12 + (em - sm) + 1;
  const years = Math.floor(months / 12);
  const rest = months % 12;

  if (years === 0) return `${rest}개월`;
  return rest === 0 ? `${years}년` : `${years}년 ${rest}개월`;
}

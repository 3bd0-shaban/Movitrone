export function GetCurrentMonthDate() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
    .toISOString()
    .split('T')[0];
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
    .toISOString()
    .split('T')[0];

  return { firstDayOfMonth, lastDayOfMonth };
}

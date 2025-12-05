// --- UTILS ---

export const getMinutes = (timeStr: string) => {
  const [h, m] = timeStr.split(":").map(Number);
  return h * 60 + m;
};

// Helper to get days for the Month Grid
export const getMonthDays = (year: number, month: number) => {
  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  const daysInMonth = lastDayOfMonth.getDate();

  // Adjust so 0 is Monday, 6 is Sunday
  let startDay = firstDayOfMonth.getDay() - 1;
  if (startDay === -1) startDay = 6;

  const days = [];

  // Padding for previous month
  for (let i = 0; i < startDay; i++) {
    days.push({ day: 0, currentMonth: false });
  }

  // Days of current month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push({ day: i, currentMonth: true });
  }

  // Padding for next month to fill grid
  while (days.length % 7 !== 0) {
    days.push({ day: 0, currentMonth: false });
  }

  return days;
};

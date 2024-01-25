export function getLessonsStats(stats: [{ title: string; total: number }]) {
  return {
    labels: stats.map((item) => item.title),
    values: stats.map((item) => item.total),
  };
}

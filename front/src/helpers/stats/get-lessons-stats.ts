// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLessonsStats(stats: any[]) {
  return {
    categories: stats.map((item) => item.title),
    values: stats.map((item) => item.total),
  };
}

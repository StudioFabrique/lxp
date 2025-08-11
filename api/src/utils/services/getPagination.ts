export function getPagination(page: number, limit: number) {
  return (Math.abs(page) - 1) * Math.abs(limit);
}

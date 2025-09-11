export function getPagination(page: number, limit: number) {
  if (page < 1) page = 1;
  if (limit < 1) limit = 1;
  return (Math.abs(page) - 1) * Math.abs(limit);
}

export function validCourseTimes(start?: string, end?: string) {
  return (!start && !end) || Boolean(start && end && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(start) && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(end) && start < end);
}


export const monthsList = [
  "janvier",
  "février",
  "mars",
  "avril",
  "mai",
  "juin",
  "juillet",
  "août",
  "septembre",
  "octobre",
  "novembre",
  "décembre",
];

export function getMaxYear() {
  return new Date().getFullYear();
}

export const monthItems = [
  {
    month: "janvier",
    maxDays: 31,
  },
  {
    month: "février",
    maxDays: 29,
  },
  {
    month: "mars",
    maxDays: 31,
  },
  {
    month: "avril",
    maxDays: 30,
  },
  {
    month: "mai",
    maxDays: 31,
  },
  {
    month: "juin",
    maxDays: 30,
  },
  {
    month: "juillet",
    maxDays: 31,
  },
  {
    month: "août",
    maxDays: 31,
  },
  {
    month: "septembre",
    maxDays: 30,
  },
  {
    month: "octobre",
    maxDays: 31,
  },
  {
    month: "novembre",
    maxDays: 30,
  },
  {
    month: "décembre",
    maxDays: 31,
  },
];

export function getMonth(monthNumber: number) {
  return monthsList[monthNumber - 1];
}

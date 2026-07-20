const monthsList = [
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

export function getMonth(monthNumber: number) {
  return monthsList[monthNumber];
}

export function convertMilisToWeeks(millisValue: number) {
  return millisValue / 604800000;
}

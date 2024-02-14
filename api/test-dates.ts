export default async function createConnectionInfos() {
  const date = new Date().getTime();
  let dates = Array<{ date: string; duration: number }>();
  for (let i = 7; i >= 1; i--) {
    const tmp = new Date(date - i * (1000 * 3600 * 24));
    const duration = getRandomNumber(1 * 1000 * 3600, 8 * 1000 * 3600);

    dates = [...dates, { date: tmp.toString(), duration: duration / 3600000 }];
  }
  console.table(dates);
}

createConnectionInfos();

function getRandomNumber(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

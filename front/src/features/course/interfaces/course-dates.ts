export default interface CourseDates {
  id?: number;
  startTime?: string;
  endTime?: string;
  minDate: string;
  maxDate: string;
  synchroneDuration: number;
  asynchroneDuration: number;
}

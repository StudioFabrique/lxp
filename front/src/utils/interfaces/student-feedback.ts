export default interface StudentFeedback {
  _id: string;
  feelingLevel: number;
  feedbackAt: string;
  name: string;
  avatar?: string;
  comment?: string;
  hasBeenReviewed: boolean;
  studentId: string;
  isSelected?: boolean;
  teacher?: string;
}

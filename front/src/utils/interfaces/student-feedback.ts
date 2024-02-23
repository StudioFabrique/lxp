export default interface StudentFeedback {
  _id: string;
  feelingLevel: string;
  feedbackAt: string;
  name: string;
  avatar?: string;
  comment?: string;
  hasBeenReviewed: boolean;
  studentId: string;
}

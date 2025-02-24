export default interface Contact {
  id?: number;
  idMdb: string;
  name: string;
  role: string;
  isSelected?: boolean;
}

export interface ContactWithMail extends Contact {
  email: string;
}

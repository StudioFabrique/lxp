export default interface Contact {
  id?: number;
  idMdb: string;
  firstname: string;
  lastname: string;
  role: string;
  isSelected?: boolean;
}

export interface ContactWithMail extends Contact {
  email: string;
  phone: string;
}

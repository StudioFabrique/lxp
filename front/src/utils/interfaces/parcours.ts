import Contact from "./contact";
import Formation from "./formation";
import Tag from "./tag";

export default interface Parcours {
  id?: number;
  title: string;
  degree: string;
  description?: string;
  image?: string;
  startDate?: string;
  endDate?: string;
  createdAt?: string;
  updatedAt?: string;
  adminId?: number;
  formation: Formation;
  tags: Array<Tag>;
  contacts: Array<Contact>;
}
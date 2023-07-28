import Formation from "./formation";

export default interface Parcours {
  id?: number;
  title: string;
  degree: string;
  description?: string;
  image?: string;
  createdAt?: string;
  updatedAt?: string;
  adminId?: number;
  formation: Formation;
}

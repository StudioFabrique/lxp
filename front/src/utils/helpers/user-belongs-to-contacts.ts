import Contact from "../interfaces/contact";
import User from "../interfaces/user";

export default function userBelongsToContacts(
  user?: User | null,
  contacts?: Contact[],
) {
  return (
    contacts?.some((contact) => contact?.idMdb === user?._id) ?? false
  );
}

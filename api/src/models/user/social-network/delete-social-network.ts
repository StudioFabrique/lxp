import Link from "../../../utils/interfaces/db/link.ts";

export default async function deleteSocialNetwork(id: string) {
  await Link.deleteOne({ _id: id });
}

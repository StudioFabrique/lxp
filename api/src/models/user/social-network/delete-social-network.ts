import Link from "../../../utils/interfaces/db/link";

export default async function deleteSocialNetwork(id: string) {
  await Link.deleteOne({ _id: id });
}

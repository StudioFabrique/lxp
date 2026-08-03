import Hobby from "../../../utils/interfaces/db/hobby.ts";

export default async function DeleteHobby(id: string) {
  await Hobby.deleteOne({ _id: id });
}

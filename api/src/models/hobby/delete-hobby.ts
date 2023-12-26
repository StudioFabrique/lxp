import Hobby from "../../utils/interfaces/db/hobby";

export default async function DeleteHobby(id: string) {
  await Hobby.deleteOne({ _id: id });
}

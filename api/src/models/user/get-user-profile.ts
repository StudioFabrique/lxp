import User from "../../utils/interfaces/db/user";

export default function getUserProfile(userId?: string) {
  return User.findById(userId)
    .select(
      "firstname lastname nickname email address city postCode phoneNumber description graduations hobbies links",
    )
    .populate(["hobbies", "links"]);
}

import { hash } from "bcrypt";

export default async function putPassword(userId: string, password: string) {
  const hashedPassword = await hash(password, 10);
}

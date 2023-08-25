import Link, { ILink } from "../../utils/interfaces/db/link";

export default async function createManyLinks(userId: string, links: ILink[]) {
  const linksUpdatedWithUserId = links.map((link) => {
    return { ...link, user: userId };
  });
  Link.insertMany(linksUpdatedWithUserId);
}

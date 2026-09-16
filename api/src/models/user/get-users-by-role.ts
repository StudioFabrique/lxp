import Role, { type IRole } from "../../utils/interfaces/db/role.ts";
import User from "../../utils/interfaces/db/user.ts";
import { imageToDataUrl } from "../../utils/images/image-source.ts";
import { getPagination } from "../../utils/services/getPagination.ts";
import { prisma } from "../../utils/db.ts";
import { isInvitationPending } from "../../utils/services/invitation-status.ts";

async function getUsersByRole(
  page: number,
  limit: number,
  role: string,
  stype: string,
  sdir: string,
  actorRank: number,
) {
  const dir = sdir === "asc" ? 1 : -1;
  let fetchedRoles;

  if (role === "everything") {
    fetchedRoles = await Role.find({}, { _id: 1 });
  } else {
    fetchedRoles = await Role.find({ role: role }, { _id: 1 });
  }

  if (fetchedRoles === undefined || fetchedRoles.length === 0) {
    throw { statusCode: 404, message: "Aucun rôle trouvé." };
  }

  const hiddenRoles = await Role.find(
    { rank: { $lte: actorRank } },
    { _id: 1 },
  );
  const userFilter = {
    $and: [
      { roles: { $in: fetchedRoles.map(({ _id }) => _id) } },
      { roles: { $nin: hiddenRoles.map(({ _id }) => _id) } },
    ],
  };

  const groupsSql = await prisma.orm.public.Group.select("idMdb")
    .include("parcours", (related51) =>
      related51.include("parcours", (related52) =>
        related52
          .select("title")
          .include("formation", (related53) => related53.select("title")),
      ),
    )
    .all();

  let groupsData = Array<any>();
  for (const group of groupsSql) {
    groupsData = [
      ...groupsData,
      {
        groupId: group.idMdb,
        parcours:
          group.parcours.length > 0 ? group.parcours[0]!.parcours!.title : "ND",
        formation:
          group.parcours.length > 0
            ? group.parcours[0]!.parcours!.formation!.title
            : "ND",
      },
    ];
  }

  /**
 Tri dynamique de la liste des utilisateurs avec Mongoose.
 Par défaut la liste est triée par la propriété "stype" passée
 en argument, puis par noms croissants et prénoms croissants.
 Les cas ou la propriété dynamique utilisée pour le tri est le nom
 ou le prénom sont pris en compte
  */

  const sortObject: any = {};

  if (stype === "firstname") {
    sortObject["firstname"] = dir; // tri dynamique par firstname
    sortObject["lastname"] = 1; // tri secondaire par lastname
  } else if (stype === "lastname") {
    sortObject["lastname"] = dir; // tri dynamique par lastname
    sortObject["firstname"] = 1; // tri secondaire par firstname
  } else {
    sortObject[stype] = dir; // tri dynamique pour n'importe quelle autre propriété
    sortObject["lastname"] = 1; // tri dynamique par lastname
    sortObject["firstname"] = 1; // tri dynamique par firstname
  }

  const data = await User.find(userFilter, {
    _id: 1,
    firstname: 1,
    lastname: 1,
    email: 1,
    avatar: 1,
    isActive: 1,
    createdAt: 1,
    emailVerified: 1,
    invitationSent: 1,
    invitationPendingSince: 1,
    group: 1,
  })
    .populate("group")
    .populate("roles", { _id: 1, role: 1, label: 1, rank: 1 })
    .sort(sortObject)
    .skip(getPagination(page, limit))
    .limit(limit);
  const total = await User.countDocuments(userFilter);

  let users = data.map((user) => {
    const groupId = user.group?.[0]?._id.toString();
    return {
      ...user.toObject(),
      parcours: groupId
        ? (groupsData.find((item) => groupId === item.groupId)?.parcours ??
          "ND")
        : "ND",
      formation: groupId
        ? (groupsData.find((item) => groupId === item.groupId)?.formation ??
          "ND")
        : "ND",
      avatar: imageToDataUrl(user.avatar),
      // État dérivé plutôt que brut : la règle de péremption d'un envoi
      // interrompu appartient au serveur, pas à chaque écran qui affiche la
      // liste.
      invitationPending: isInvitationPending(user.invitationPendingSince),
    };
  });
  return { total, users };
}
export default getUsersByRole;

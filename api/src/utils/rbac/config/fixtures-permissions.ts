import { resourcesRbacByRank } from "./ressources-rbac.ts";

// Keep test/development fixtures on the same permission matrix used when a
// dynamic role is created or reset. This prevents newly declared resources
// from silently becoming inaccessible to existing system roles.
export const permDefsActions = {
  admin: {
    read: [...resourcesRbacByRank[1].read],
    write: [...resourcesRbacByRank[1].write],
    update: [...resourcesRbacByRank[1].update],
    delete: [...resourcesRbacByRank[1].delete],
  },
  teacher: {
    read: [...resourcesRbacByRank[2].read],
    write: [...resourcesRbacByRank[2].write],
    update: [...resourcesRbacByRank[2].update],
    delete: [...resourcesRbacByRank[2].delete],
  },
  student: {
    read: [...resourcesRbacByRank[3].read],
    write: [...resourcesRbacByRank[3].write],
    update: [...resourcesRbacByRank[3].update],
    delete: [...resourcesRbacByRank[3].delete],
  },
};

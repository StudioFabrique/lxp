/** Étape « Informations » de l'édition d'un parcours, où se gère l'équipe pédagogique. */
const PARCOURS_INFORMATIONS_STEP = 1;
/** Rang du rôle des membres de l'équipe pédagogique (contacts). */
export const PARCOURS_CONTACT_ROLE_RANK = 2;

const PARCOURS_EDIT_PATH = /^\/admin\/parcours\/edit\/\d+$/;

/** Adresse de la création d'utilisateur, avec retour sur les informations du parcours. */
export const createContactUrlFromParcours = (parcoursId: number | string) => {
  const returnTo = `/admin/parcours/edit/${parcoursId}?step=${PARCOURS_INFORMATIONS_STEP}`;
  const searchParams = new URLSearchParams({
    returnTo,
    roleRank: String(PARCOURS_CONTACT_ROLE_RANK),
  });
  return `/admin/user/add?${searchParams.toString()}`;
};

/** Ne conserve qu'un retour interne vers l'édition d'un parcours (évite une redirection ouverte). */
export const getSafeParcoursReturnPath = (returnTo: string | null) => {
  if (!returnTo?.startsWith("/")) return null;

  const url = new URL(returnTo, "https://lxp.local");
  if (url.origin !== "https://lxp.local" || !PARCOURS_EDIT_PATH.test(url.pathname)) {
    return null;
  }
  return `${url.pathname}${url.search}`;
};

/** Paramètre d'URL portant l'utilisateur créé, à ajouter automatiquement à l'équipe du parcours. */
export const CREATED_CONTACT_PARAM = "createdContact";

/** Ajoute à l'adresse de retour l'identifiant (MongoDB) du contact tout juste créé. */
export const addCreatedContactToReturnPath = (
  returnTo: string,
  userId: string,
) => {
  const url = new URL(returnTo, "https://lxp.local");
  url.searchParams.set(CREATED_CONTACT_PARAM, userId);
  return `${url.pathname}?${url.searchParams.toString()}`;
};

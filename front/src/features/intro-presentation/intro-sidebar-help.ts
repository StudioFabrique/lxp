import type { SidebarItemConfig, SidebarLayout } from "../../config/sidebarItems";

/**
 * Explication de chaque entrée de la barre latérale, lue par le tutoriel qui
 * interrompt la séquence 3D. Les clés sont celles de `sidebarItems`.
 */
const SIDEBAR_HELP: Record<SidebarLayout, Record<string, string>> = {
  admin: {
    home: "Votre tableau de bord : les actions recommandées, les derniers modules et parcours créés, et les retours des apprenants.",
    user: "Créez et gérez les comptes utilisateurs, leurs rôles et leurs accès.",
    group: "Organisez les apprenants et l'équipe en groupes, et rattachez-les à vos formations.",
    parcours: "Construisez les parcours de vos formations et gardez la main sur leur contenu.",
    module: "Découpez un parcours en modules pour structurer la progression des apprenants.",
    course: "Rédigez les cours avec leurs leçons et leurs activités, puis publiez-les.",
    calendar: "Planifiez les séances et consultez le calendrier de vos groupes.",
    evaluations: "Corrigez les travaux remis par les apprenants et donnez vos retours pédagogiques.",
    resource: "Ajoutez des ressources complémentaires à proposer aux apprenants.",
    role: "Définissez les rôles et les permissions associées à chaque profil.",
    tag: "Classez vos contenus avec des tags pour les retrouver plus vite.",
    mediatheque: "Retrouvez et réutilisez les images, vidéos et fichiers déjà importés.",
  },
  student: {
    home: "Votre tableau de bord : reprenez votre dernière leçon et suivez votre avancement.",
    parcours: "Retrouvez vos parcours, avec leurs modules, leurs cours et leurs leçons.",
    calendar: "Consultez vos prochaines séances.",
    assignments: "Remettez vos travaux et consultez les retours de l'équipe pédagogique.",
    resources: "Accédez aux ressources complémentaires proposées pour vos formations.",
  },
};

export const getSidebarHelp = (
  layout: SidebarLayout,
  item: SidebarItemConfig,
): string => SIDEBAR_HELP[layout][item.key] ?? "";

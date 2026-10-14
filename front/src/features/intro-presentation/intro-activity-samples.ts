import type { Activity } from "../../utils/interfaces/activity";

export type IntroActivityKind = "text" | "video" | "image" | "resource";

/** Types d'activités présentés par les quatre cartes du dernier niveau, selon leur intitulé. */
const KIND_BY_TITLE: Record<string, IntroActivityKind> = {
  Texte: "text",
  Vidéo: "video",
  Image: "image",
  Ressource: "resource",
};

export const introActivityKind = (title: string): IntroActivityKind | undefined =>
  KIND_BY_TITLE[title];

export const INTRO_TEXT_SAMPLE = `
<h2>Titres et paragraphes</h2>
<p>Une page web s'organise autour de <strong>titres</strong> et de <strong>paragraphes</strong>. Les titres structurent le contenu, les paragraphes portent le texte.</p>
<ul>
  <li>Un seul titre principal par page</li>
  <li>Des sous-titres pour chaque partie</li>
  <li>Des paragraphes courts et lisibles</li>
</ul>
`;

/** Image livrée avec l'application : l'aperçu ne dépend d'aucun contenu de l'instance. */
export const INTRO_IMAGE_SAMPLE = {
  src: "/images/parcours-default.webp",
  alt: "Illustration d'une activité de type image",
};

const SAMPLE_DATE = "2024-01-01T00:00:00.000Z";

/** Exemples d'activités passés tels quels au composant d'aperçu des modules. */
export const INTRO_VIDEO_SAMPLE: Activity = {
  id: -1,
  type: "video",
  order: 1,
  url: "https://www.youtube.com/watch?v=UB1O30fR-EE",
  title: "Vidéo d'exemple",
  createdAt: SAMPLE_DATE,
  updatedAt: SAMPLE_DATE,
};

export const INTRO_RESOURCE_SAMPLE: Activity = {
  id: -2,
  type: "resource",
  order: 1,
  url: "",
  title: "Ressources d'exemple",
  createdAt: SAMPLE_DATE,
  updatedAt: SAMPLE_DATE,
  resourceActivities: [
    { id: -1, order: 1, label: "Guide d'apprentissage du HTML", url: "https://developer.mozilla.org/fr/docs/Learn_web_development/Core/Structuring_content" },
    { id: -2, order: 2, label: "Référence des éléments HTML", url: "https://developer.mozilla.org/fr/docs/Web/HTML/Reference/Elements" },
  ],
};

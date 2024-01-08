import { Request, Response } from "express";

async function httpGetAllSkills(req: Request, res: Response) {
  return res.status(200).json({
    total: 5,
    list: [
      {
        id: 1,
        title: "HTML5",
        description:
          'Langage de balisage utilisé pour structurer le contenu d"une page web.',
        /*         badge: {
          id: 1,
          title: "HTML5",
          icon: "badge-react.png",
        }, */
      },
      {
        id: 2,
        title: "CSS3",
        description:
          'Langage de style utilisé pour définir la présentation visuelle d"une page web.',
        badge: {
          id: 2,
          title: "CSS3",
          icon: "badge-react.png",
        },
      },
      {
        id: 3,
        title: "JavaScript",
        description:
          "Langage de programmation côté client pour ajouter des fonctionnalités interactives aux sites web.",
        badge: {
          id: 3,
          title: "JavaScript",
          icon: "badge-react.png",
        },
      },
      {
        id: 4,
        title: "jQuery",
        description:
          'Bibliothèque JavaScript rapide, petite et riche en fonctionnalités pour simplifier l"interaction avec les documents HTML.',
        badge: {
          id: 4,
          title: "jQuery",
          icon: "badge-react.png",
        },
      },
      {
        id: 5,
        title: "Bootstrap",
        description:
          "Framework CSS populaire pour la création rapide et réactive de sites web.",
        badge: {
          id: 5,
          title: "Bootstrap",
          icon: "badge-react.png",
        },
      },
    ],
  });
}

export default httpGetAllSkills;

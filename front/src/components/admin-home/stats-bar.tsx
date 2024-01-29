import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import { getLessonsStats } from "../../helpers/stats/get-lessons-stats";
import VerticalBars from "../UI/vertical-bars";

interface Response {
  title: string;
  total: number;
}

const leconsJavaScript = [
  "Introduction à JavaScript",
  "Variables et types de données",
  "Opérateurs et expressions",
  "Structures de contrôle (if, else, switch)",
  "Boucles (for, while, do-while)",
  "Fonctions en JavaScript",
  "Tableaux et objets",
  "Manipulation du DOM",
  "Événements et gestion d'événements",
  "AJAX et requêtes asynchrones",
];

export default function StatsBar() {
  const { sendRequest } = useHttp();
  const [categories, setCategories] = useState<string[]>([]);
  const [values, setValues] = useState<number[]>([]);

  const getStats = useCallback(() => {
    const applyData = (data: {
      success: boolean;
      message: string;
      response: Response[];
    }) => {
      const stats = getLessonsStats(data.response);
      // TODO quand les données seront disponibles, effacez ce bloc de code et décommentez le bloc de code suivant.
      setCategories(leconsJavaScript);
      const randomValues = Array.from(
        { length: 10 },
        () => Math.floor(Math.random() * (200 - 10 + 1)) + 10
      );
      setValues(randomValues);
      // --FIN--

      /*  --DEBUT--
      setCategories(stats.categories)
      setValues(stats.values) 
          --FIN-- */
    };
    sendRequest(
      {
        path: "/stats/lessons-read",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    getStats();
  }, [getStats]);

  return (
    <>
      {categories && categories.length > 0 ? (
        <div className="h-full flex flex-col justify-between items-center gap-y-2">
          <h2 className="text-xs font-bold">
            Contenus terminés (par nombre d'apprenants)
          </h2>
          <VerticalBars
            categories={categories}
            series={[
              {
                name: "Leçons",
                data: values,
              },
            ]}
            label="Leçons"
            type="bar"
          />
        </div>
      ) : (
        <p className="w-full h-full flex justify-center items-center">
          Aucune statistique à afficher.
        </p>
      )}
    </>
  );
}

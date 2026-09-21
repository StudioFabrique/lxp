import { useEffect, useMemo, useState } from "react";
import { History } from "lucide-react";
import { profileApi } from "../../api/profile.api";
import Loader from "../../../../components/loaders/Loader";
import Parcours from "../../../../utils/interfaces/parcours";
import JournalTree from "./journal-tree";

const Journal = () => {
  const [isLoading, setIsLoading] = useState(true);

  const [parcours, setParcours] = useState<Parcours[]>([]);

  useEffect(() => {
    profileApi.queries
      .getAccomplishments()
      .then((data) => setParcours(data.data ?? []))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, []);

  const accomplishmentCount = useMemo(
    () =>
      parcours.reduce(
        (total, item) =>
          total +
          (item.modules ?? []).reduce(
            (moduleTotal, module) =>
              moduleTotal +
              (module.courses ?? []).reduce(
                (courseTotal, course) =>
                  courseTotal + (course.accomplishments?.length ?? 0),
                0,
              ),
            0,
          ),
        0,
      ),
    [parcours],
  );

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <div>
          <h3 className="flex items-center gap-2 text-xl font-bold">
            <History className="h-5 w-5 text-primary" aria-hidden="true" />
            Mon historique d'accomplissements
          </h3>
          <p className="mt-1 text-sm text-base-content/60">
            Retrouvez les étapes que vous avez validées au fil de vos cours.
          </p>
        </div>
        {!isLoading && accomplishmentCount > 0 && (
          <span className="badge badge-primary badge-outline">
            {accomplishmentCount} accomplissement{accomplishmentCount > 1 ? "s" : ""}
          </span>
        )}
      </div>

      {isLoading ? (
        <Loader />
      ) : parcours.length > 0 ? (
        <JournalTree parcoursList={parcours} />
      ) : (
        <div className="rounded-2xl border border-dashed border-base-300 bg-base-200/50 px-6 py-10 text-center">
          <p className="font-semibold">Votre historique est encore vide</p>
          <p className="mt-1 text-sm text-base-content/60">
            Vos prochains accomplissements apparaîtront ici.
          </p>
        </div>
      )}
    </div>
  );
};

export default Journal;

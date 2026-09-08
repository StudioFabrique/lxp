import { Link } from "react-router";
import BoxWrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { CheckCircle2 } from "lucide-react";

type Props = {
  parcoursId: number;
};

export default function GroupFormParcoursWarning({ parcoursId }: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex flex-col gap-y-4">
        <BoxWrapper>
          <div className="flex items-center gap-3">
            <div className="flex flex-col items-center gap-5">
              <div className="flex gap-5 items-center">
                <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
                <h2 className="font-bold text-xl">Parcours déjà sélectionné</h2>
              </div>
              <p className="mt-2 text-sm text-base-content/70 text-center">
                Ce groupe sera automatiquement rattaché au parcours depuis
                lequel vous avez ouvert ce formulaire.
              </p>
              <Link
                to={`/admin/parcours/edit/${parcoursId}?step=6`}
                className="btn btn-primary"
              >
                Annuler et retourner au parcours
              </Link>
            </div>
          </div>
        </BoxWrapper>
      </div>
    </div>
  );
}

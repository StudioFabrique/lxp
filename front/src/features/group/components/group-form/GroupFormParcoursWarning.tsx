import { Link } from "react-router";
import Wrapper from "../../../../../src/components/wrappers/BoxWrapper";
import { CheckCircle2 } from "lucide-react";

type Props = {
  parcoursId: number;
};

export default function GroupFormParcoursWarning({ parcoursId }: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-full flex flex-col gap-y-4">
        <Wrapper>
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-success" />
            <div>
              <h2 className="font-bold text-xl">Parcours déjà sélectionné</h2>
              <p className="mt-2 text-sm text-base-content/70">
                Ce groupe sera automatiquement rattaché au parcours depuis
                lequel vous avez ouvert ce formulaire.
              </p>
            </div>
          </div>
        </Wrapper>
        <span className="flex justify-center items-center">
          <Link
            to={`/admin/parcours/edit/${parcoursId}?step=6`}
            className="btn btn-primary"
          >
            Annuler et retourner au parcours
          </Link>
        </span>
      </div>
    </div>
  );
}

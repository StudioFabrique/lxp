import { Link } from "react-router-dom";
import Wrapper from "../../../UI/wrapper/wrapper.component";

type Props = {
  parcoursId: number;
};

export default function FromParcoursWarning({ parcoursId }: Props) {
  return (
    <div className="w-full flex flex-col items-center justify-center">
      <div className="w-5/6 flex flex-col gap-y-4">
        <Wrapper>
          <p>
            Le groupe sera automatiquement attaché au parcours de formation que
            vous étiez en train de créer.
          </p>
          <p className="text-info">
            Si vous souhaiter retourner au parcours de formation sans créer de
            groupe cliquer sur le bouton ci-dessous.
          </p>
        </Wrapper>
        <span className="flex justify-center items-center">
          <Link
            to={`/admin/parcours/edit/${parcoursId}?step=6`}
            className="btn btn-primary"
          >
            Retourner au parcours
          </Link>
        </span>
      </div>
    </div>
  );
}

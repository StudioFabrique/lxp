import { useSelector } from "react-redux";

import ParcoursPreviewInfos from "./parcours-preview-infos.component";
import ParcoursPreviewModules from "./parcours-preview-modules.component";
import ParcoursPreviewStudent from "./parcours-preview-student";
import Objective from "../../../utils/interfaces/objective";
import PreviewObjectives from "../../preview/preview-objectives";
import Skill from "../../../utils/interfaces/skill";
import PreviewSkills from "../../preview/preview-skills";

interface ParcoursPreviewProps {
  onEdit: (id: number) => void;
}

const ParcoursPreview = (props: ParcoursPreviewProps) => {
  const objectives = useSelector(
    (state: any) => state.parcoursObjectives.objectives
  ) as Objective[];
  const skills = useSelector(
    (state: any) => state.parcoursSkills.skills
  ) as Skill[];

  return (
    /* En tête de l'aperçu */
    <div className="w-full flex flex-col gap-y-8">
      <section>
        <h1 className="text-3xl font-extrabold">Aperçu général</h1>
      </section>
      {/* Infos générales du parcours */}
      <section>
        <ParcoursPreviewInfos onEdit={props.onEdit} />
      </section>
      {/* Objectifs du parcours */}
      <section>
        <PreviewObjectives objectives={objectives} onEdit={props.onEdit} />
      </section>
      {/* Compétences du parcours */}
      <section>
        <PreviewSkills skills={skills} onEdit={props.onEdit} />
      </section>
      {/* Modules du parcours */}
      <section>
        <ParcoursPreviewModules onEdit={props.onEdit} />
      </section>
      {/* étudiants rattachés au parcours */}
      <section>
        <ParcoursPreviewStudent onEdit={props.onEdit} />
      </section>
      {/* TOTO : insérez le calendrier et les étudiants */}
    </div>
  );
};
export default ParcoursPreview;

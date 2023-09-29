import ParcoursPreviewInfos from "./parcours-preview-infos.component";
import ParcoursPreviewModules from "./parcours-preview-modules.component";
import ParcoursPreviewObjectives from "./parcours-preview-objectives.component";
import ParcoursPreviewSkills from "./parcours-preview-skills.component";
import ParcoursPreviewStudent from "./parcours-preview-student";

interface ParcoursPreviewProps {
  onEdit: (id: number) => void;
}

/* Cyril */
const ParcoursPreview = (props: ParcoursPreviewProps) => {
  return (
    /* En tête de l'aperçu */
    <div className="w-full flex flex-col gap-y-8">
      <section>
        <h1 className="text-2xl font-extrabold">Aperçu général</h1>
      </section>
      {/* Infos générales du parcours */}
      <section>
        <ParcoursPreviewInfos onEdit={props.onEdit} />
      </section>
      {/* Objectifs du parcours */}
      <section>
        <ParcoursPreviewObjectives onEdit={props.onEdit} />
      </section>
      {/* Compétences du parcours */}
      <section>
        <ParcoursPreviewSkills onEdit={props.onEdit} />
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

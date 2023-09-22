import ParcoursPreviewInfos from "./parcours-preview-infos.component";
import ParcoursPreviewModules from "./parcours-preview-modules.component";
import ParcoursPreviewObjectives from "./parcours-preview-objectives.component";
import ParcoursPreviewSkills from "./parcours-preview-skills.component";

/* Cyril */
const ParcoursPreview = () => {
  return (
    /* En tête de l'aperçu */
    <div className="flex flex-col gap-y-8">
      <section>
        <h1 className="text-2xl font-extrabold">Aperçu général</h1>
      </section>
      {/* Infos générales du parcours */}
      <section>
        <ParcoursPreviewInfos />
      </section>
      {/* Objectifs du parcours */}
      <section>
        <ParcoursPreviewObjectives />
      </section>
      {/* Compétences du parcours */}
      <section>
        <ParcoursPreviewSkills />
      </section>
      {/* Modules du parcours */}
      <section>
        <ParcoursPreviewModules />
      </section>
      {/* TOTO : insérez le calendrier et les étudiants */}
    </div>
  );
};
export default ParcoursPreview;

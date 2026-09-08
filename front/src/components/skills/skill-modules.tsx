import { Link } from "react-router";
import type Skill from "../../utils/interfaces/skill";

export default function SkillModules({ skill, onNavigate }: { skill: Skill; onNavigate?: () => void }) {
  if (!skill.modules?.length) {
    return <p className="text-sm text-base-content/60">Aucun module associé à cette compétence.</p>;
  }

  return (
    <ul aria-label={`Modules associés à ${skill.description}`} className="flex w-full flex-col gap-2 text-left text-sm">
      {skill.modules.map((module) => (
        <li key={module.id} className="rounded-lg bg-base-200 p-3">
          <Link className="link link-hover font-medium" to={`/student/parcours/module/${module.id}`} onClick={onNavigate}>
            {module.title}
          </Link>
          <p className={module.isCompleted ? "text-success" : "text-base-content/70"}>
            {module.isCompleted ? "Terminé" : `À terminer · ${module.progress} %`}
          </p>
        </li>
      ))}
    </ul>
  );
}

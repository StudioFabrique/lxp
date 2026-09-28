import { Link } from "react-router";
import type Skill from "../../utils/interfaces/skill";
import { cn } from "../../utils/cn";
import { LockKeyhole } from "lucide-react";

export default function SkillModules({ skill, onNavigate }: { skill: Skill; onNavigate?: () => void }) {
  if (!skill.modules?.length) {
    return <p className="text-sm text-base-content/60">Aucun module associé à cette compétence.</p>;
  }

  return (
    <ul aria-label={`Modules associés à ${skill.description}`} className="flex w-full flex-col gap-2 text-left text-sm">
      {skill.modules.map((module) => (
        <li key={module.id} className={cn("rounded-lg bg-base-200 p-3", module.hasContent === false && "opacity-60")}>
          {module.hasContent === false ? (
            <span className="tooltip tooltip-right inline-flex items-center gap-2 font-medium" data-tip="Aucun contenu disponible dans ce module" title="Aucun contenu disponible dans ce module">
              <LockKeyhole className="size-4 shrink-0" aria-hidden="true" />
              <span className="first-letter:uppercase">{module.title}</span>
            </span>
          ) : (
            <Link className="link link-hover font-medium" to={`/student/parcours/module/${module.id}`} onClick={onNavigate}>
              <span className="inline-block first-letter:uppercase">{module.title}</span>
            </Link>
          )}
          <p className={cn(module.isCompleted ? "text-success" : "text-base-content/70")}>
            {module.hasContent === false ? "Contenu indisponible" : module.isCompleted ? "Terminé" : `À terminer : ${module.progress} %`}
          </p>
        </li>
      ))}
    </ul>
  );
}

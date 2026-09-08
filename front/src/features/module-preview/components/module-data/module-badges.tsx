import { useContext } from "react";
import { AuthContext } from "../../../../store/AuthProvider";
import { getUserArea } from "../../../../utils/helpers/user-role";
import type Skill from "../../../../utils/interfaces/skill";

export default function ModuleBadges({ skills }: { skills: Skill[] }) {
  const { user } = useContext(AuthContext);
  const isStudent = getUserArea(user) === "student";
  const badges = skills.filter((skill) => skill.badge);
  if (!badges.length) return null;

  return (
    <ul aria-label="Badges du module" className="flex flex-wrap gap-5 py-3">
      {badges.map((skill) => (
        <li key={skill.id} className="flex w-28 flex-col items-center gap-2 text-center">
          <img
            src={skill.badge}
            alt={skill.description}
            title={isStudent ? (skill.isEarned ? "Badge obtenu" : "Badge à obtenir") : undefined}
            className={`size-20 object-contain transition-opacity ${isStudent && !skill.isEarned ? "opacity-30" : "opacity-100"}`}
          />
          <span className="text-sm first-letter:uppercase">{skill.description}</span>
        </li>
      ))}
    </ul>
  );
}

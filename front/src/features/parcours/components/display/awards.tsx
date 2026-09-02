import { useParams } from "react-router";
import { useParcoursSkills } from "../../hooks/useParcoursSkills";
import CollapsibleSection from "./collapsible-section";

const Awards = () => {
  const { id } = useParams();
  const { skills } = useParcoursSkills(Number(id));
  const badgeSkills = skills.filter((skill) => Boolean(skill.badge));

  if (badgeSkills.length === 0) return null;

  return (
    <CollapsibleSection
      title="Badges"
      preview={
        <span className="flex h-10 items-center gap-2 overflow-hidden">
          {badgeSkills.slice(0, 4).map((skill) => (
            <img
              key={skill.id}
              src={skill.badge}
              alt=""
              className="size-10 shrink-0 object-contain"
            />
          ))}
          {badgeSkills.length > 4 ? (
            <span className="text-xs opacity-60">
              +{badgeSkills.length - 4}
            </span>
          ) : null}
        </span>
      }
    >
      <div className="flex gap-4 flex-wrap overflow-y-auto">
        {badgeSkills.map((skill) => (
          <div key={skill.id}>
            <img src={skill.badge} alt="" />
          </div>
        ))}
      </div>
    </CollapsibleSection>
  );
};

export default Awards;

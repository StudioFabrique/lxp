import { AvatarSmall } from "../../../components/avatar/AvatarSmall";
import type User from "../../../utils/interfaces/user";
import { toTitleCase } from "../../../utils/helpers/text-helpers";
import { cn } from "../../../utils/cn";

export default function OnboardingStudentIdentity({ student }: { student: User }) {
  return (
    <div className="flex min-w-0 flex-1 items-center gap-3">
      <span className="shrink-0"><AvatarSmall user={student} size={10} /></span>
      <div className="min-w-0 flex-1">
        <p className="break-words text-sm font-semibold">{toTitleCase(`${student.firstname} ${student.lastname}`)}</p>
        <p className="mt-1 break-words text-xs text-base-content/65">{student.email}</p>
        <span className={cn("badge badge-sm mt-2", student.isActive ? "badge-success badge-outline" : "badge-ghost")}>
          {student.isActive ? "Actif" : "Inactif"}
        </span>
      </div>
    </div>
  );
}

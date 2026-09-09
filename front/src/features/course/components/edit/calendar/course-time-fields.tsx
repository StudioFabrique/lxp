import { useState } from "react";
import { validCourseTimes } from "../../../helpers/course-times";

function timeAfter(start: string, minutes: number) {
  const [hours, mins] = start.split(":").map(Number);
  // Les horaires quotidiens doivent rester dans la même journée.
  const end = Math.min(hours * 60 + mins + minutes, 23 * 60 + 59);
  return `${String(Math.floor(end / 60)).padStart(2, "0")}:${String(end % 60).padStart(2, "0")}`;
}

export default function CourseTimeFields({ startTime, endTime, onChange }: {
  startTime?: string;
  endTime?: string;
  onChange: (times: { startTime?: string; endTime?: string }) => void;
}) {
  const [showError, setShowError] = useState(false);
  return <div className="@container space-y-2">
    <p className="text-sm font-medium">Horaires quotidiens (facultatifs)</p>
    <div className="grid grid-cols-1 gap-3 @min-[16rem]:grid-cols-2">
      <label className="flex min-w-0 flex-col gap-1 text-sm">Heure de début
        <input type="time" className="input input-sm w-full" value={startTime ?? ""} max="23:58"
          onBlur={() => setShowError(true)}
          onChange={e => {
            const start = e.target.value || undefined;
            setShowError(false);
            onChange({ startTime: start, endTime: start ? timeAfter(start, 120) : undefined });
          }} />
      </label>
      <label className="flex min-w-0 flex-col gap-1 text-sm">Heure de fin
        <input type="time" className="input input-sm w-full" value={endTime ?? ""}
          disabled={!startTime} min={startTime ? timeAfter(startTime, 1) : undefined}
          onBlur={() => setShowError(true)}
          onChange={e => {
            setShowError(false);
            onChange({ startTime, endTime: e.target.value || undefined });
          }} />
      </label>
    </div>
    <p className="text-xs text-base-content/60">Ces horaires s’appliquent chaque jour de la plage de dates.</p>
    {(startTime || endTime) && <button type="button" className="btn btn-xs btn-ghost" onClick={() => onChange({ startTime: undefined, endTime: undefined })}>Retirer les horaires</button>}
    {showError && !validCourseTimes(startTime, endTime) && <p role="alert" className="text-sm text-error">Renseignez une heure de fin après le début.</p>}
  </div>;
}

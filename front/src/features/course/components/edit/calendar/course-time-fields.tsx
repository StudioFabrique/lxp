import { validCourseTimes } from "../../../helpers/course-times";

export default function CourseTimeFields({ startTime, endTime, onChange }: {
  startTime?: string;
  endTime?: string;
  onChange: (times: { startTime?: string; endTime?: string }) => void;
}) {
  return <div className="space-y-2">
    <p className="text-sm font-medium">Horaires quotidiens (facultatifs)</p>
    <div className="grid grid-cols-2 gap-3">
      <label className="flex min-w-0 flex-col gap-1 text-sm">Heure de début
        <input type="time" className="input input-sm w-full" value={startTime ?? ""}
          onChange={e => onChange({ startTime: e.target.value || undefined, endTime })} />
      </label>
      <label className="flex min-w-0 flex-col gap-1 text-sm">Heure de fin
        <input type="time" className="input input-sm w-full" value={endTime ?? ""}
          onChange={e => onChange({ startTime, endTime: e.target.value || undefined })} />
      </label>
    </div>
    <p className="text-xs text-base-content/60">Ces horaires s’appliquent chaque jour de la plage de dates.</p>
    {(startTime || endTime) && <button type="button" className="btn btn-xs btn-ghost" onClick={() => onChange({ startTime: undefined, endTime: undefined })}>Retirer les horaires</button>}
    {!validCourseTimes(startTime, endTime) && <p role="alert" className="text-sm text-error">Renseignez les deux heures, avec une fin après le début.</p>}
  </div>;
}

import { useState, type Dispatch, type SetStateAction } from "react";
import { useQuery } from "@tanstack/react-query";
import RightSideDrawer from "../../../components/UI/right-side-drawer/right-side-drawer";
import { dashboardAdminApi } from "../../dashboard-admin/api/dashboard-admin.api";
import { groupApi } from "../../group/api/group.api";
import { formatTitle } from "../../../utils/helpers/text-helpers";

type Props = {
  name: string;
  setName: (name: string) => void;
  parcoursId: number;
  setParcoursId: (id: number) => void;
  selected: Record<string, boolean>;
  setSelected: Dispatch<SetStateAction<Record<string, boolean>>>;
};

export default function TeacherGroupFields({ name, setName, parcoursId, setParcoursId, selected, setSelected }: Props) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [search, setSearch] = useState("");
  const parcours = useQuery({ queryKey: ["root-parcours"], queryFn: dashboardAdminApi.queries.getRootParcours });
  const students = useQuery({
    queryKey: ["onboarding", "available-students", search],
    queryFn: () => groupApi.queries.getStudents({ currentPage: 1, itemsPerPage: 50, sortProperty: "lastname", isAscDirection: true, searchValue: search || null, excludedUserIds: [] }),
  });
  const options = parcours.data?.flatMap((formation) => formation.parcours) ?? [];
  const count = Object.keys(selected).length;
  const visibleStudents = students.data?.list ?? [];
  const allVisibleSelected = visibleStudents.length > 0 && visibleStudents.every((student) => student._id in selected);

  const toggleVisibleStudents = () => {
    setSelected((current) => {
      const next = { ...current };
      for (const student of visibleStudents) {
        if (allVisibleSelected) delete next[student._id];
        else next[student._id] = student.isActive;
      }
      return next;
    });
  };

  return <div className="flex flex-col gap-4 border-t border-secondary/15 pt-4">
    <label className="flex flex-col gap-2 text-sm font-semibold">Nom du groupe
      <input className="input input-bordered w-full" value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Promotion 2026" maxLength={100} required />
    </label>
    <label className="flex flex-col gap-2 text-sm font-semibold">Parcours associé
      <select className="select select-bordered w-full" value={parcoursId} onChange={(event) => setParcoursId(Number(event.target.value))}>
        <option value={0}>Associer un parcours plus tard</option>
        {options.map((item) => <option key={item.id} value={item.id}>{formatTitle(item.title.replace(/\s*·\s*/g, " — "))}</option>)}
      </select>
    </label>
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div><h3 className="text-sm font-semibold">Apprenants</h3><p className="text-sm text-base-content/60">{count ? `${count} sélectionné${count > 1 ? "s" : ""}` : "Aucun apprenant sélectionné"}</p></div>
      <button type="button" className="btn btn-outline btn-sm" onClick={() => setDrawerOpen(true)}>Choisir des apprenants</button>
    </div>
    <RightSideDrawer title="Choisir les apprenants" id="teacher-onboarding-students" visible={false} isOpen={drawerOpen} onCloseDrawer={() => setDrawerOpen(false)} panelClassName="min-w-0 w-full max-w-lg">
      <div className="flex min-h-full flex-col gap-4">
        <p className="text-sm text-base-content/65">Sélectionnez les apprenants à ajouter au groupe. Vous pourrez modifier cette liste plus tard.</p>
        <input className="input input-bordered w-full" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Rechercher un apprenant" aria-label="Rechercher un apprenant" />
        {visibleStudents.length > 0 && <button type="button" className="btn btn-ghost btn-sm self-end" onClick={toggleVisibleStudents}>
          {allVisibleSelected ? "Tout désélectionner" : "Tout sélectionner"}
        </button>}
        {students.isPending ? <p className="text-sm">Chargement des apprenants…</p>
          : students.isError ? <p role="alert" className="text-sm">Impossible de charger les apprenants.</p>
          : students.data?.list.length ? <div className="space-y-1">
            {students.data.list.map((student) => <label key={student._id} className="flex cursor-pointer items-center gap-3 rounded-lg border border-base-300 bg-base-100 p-3 hover:border-primary/40">
              <input type="checkbox" className="checkbox checkbox-primary checkbox-sm" checked={student._id in selected} onChange={(event) => setSelected((current) => {
                const next = { ...current };
                if (event.target.checked) next[student._id] = student.isActive;
                else delete next[student._id];
                return next;
              })} />
              <span>{student.firstname} {student.lastname}</span>
            </label>)}
          </div> : <p className="text-sm text-base-content/60">Aucun apprenant trouvé. Vous pourrez en ajouter après l’accueil.</p>}
        <button type="button" className="btn btn-primary mt-auto" onClick={() => setDrawerOpen(false)}>Valider la sélection ({count})</button>
      </div>
    </RightSideDrawer>
  </div>;
}

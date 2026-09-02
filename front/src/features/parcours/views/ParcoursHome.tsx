import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";

import { parcoursApi } from "../api/parcours.api";
import Loader from "../../../../src/components/loaders/Loader";
import { sortArray } from "../../../../src/utils/helpers/sort-array";
import { useLocation } from "react-router";
import { dashboardAdminApi } from "../../dashboard-admin/api/dashboard-admin.api";
import AdminParcoursManagement from "../components/list/admin-parcours-management";
import type { FormationParcoursSummary } from "../../dashboard-admin/interfaces/parcours-summary";

const ParcoursHome = () => {
  const { pathname } = useLocation();

  const currentRoute = useMemo(
    () => pathname.split("/").slice(1) ?? [],
    [pathname],
  );

  const asStudent = currentRoute[0] === "student";

  const { data: studentParcoursList, isLoading: isStudentParcoursLoading } =
    useQuery({
      queryKey: ["parcours", { asStudent: true }],
      queryFn: () => parcoursApi.queries.getAll(true),
      select: (data) => sortArray(data, "id"),
      enabled: asStudent,
    });

  const { data: formations = [], isLoading: isAdminParcoursLoading } = useQuery(
    {
      queryKey: ["root-parcours"],
      queryFn: dashboardAdminApi.queries.getRootParcours,
      enabled: !asStudent,
    },
  );

  const studentFormations = useMemo<FormationParcoursSummary[]>(() => {
    const groupedFormations = new Map<string, FormationParcoursSummary>();

    for (const parcours of studentParcoursList ?? []) {
      const key = String(parcours.formation.id ?? parcours.formation.title);
      const currentFormation = groupedFormations.get(key) ?? {
        id: parcours.formation.id ?? -(groupedFormations.size + 1),
        title: parcours.formation.title,
        level: parcours.formation.level,
        parcours: [],
      };

      currentFormation.parcours.push({
        id: parcours.id,
        title: parcours.title,
        startDate: parcours.startDate ?? null,
        endDate: parcours.endDate ?? null,
        isPublished: parcours.isPublished,
        thumb: parcours.thumb ?? parcours.image ?? null,
      });
      groupedFormations.set(key, currentFormation);
    }

    return [...groupedFormations.values()];
  }, [studentParcoursList]);

  if (!asStudent) {
    return isAdminParcoursLoading ? (
      <div className="flex items-center">
        <Loader />
      </div>
    ) : (
      <AdminParcoursManagement formations={formations} layout="admin" />
    );
  }

  return (
    <div>
      {isStudentParcoursLoading ? (
        <div className="flex items-center">
          <Loader />
        </div>
      ) : (
        <AdminParcoursManagement
          formations={studentFormations}
          layout="student"
        />
      )}
    </div>
  );
};

export default ParcoursHome;

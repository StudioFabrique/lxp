import { useQuery } from "@tanstack/react-query";
import { ArrowLeft, Brain, Users } from "lucide-react";
import { Link, useLocation, useParams } from "react-router";
import Header from "../../../components/headers/Header";
import LoadingSkeleton from "../../../components/loaders/LoadingSkeleton";
import BoxWrapper from "../../../components/wrappers/BoxWrapper";
import PageWrapper from "../../../components/wrappers/PageWrapper";
import { dashboardIAApi } from "../api/dashboardIA.api";
import { toTitleCase } from "../../../utils/helpers/text-helpers";

export default function GroupDropoutAnalysis() {
  const { groupId } = useParams();
  const location = useLocation();
  const groupName = (location.state as { groupName?: string } | null)
    ?.groupName;
  const query = useQuery({
    queryKey: ["dropout-summaries"],
    queryFn: dashboardIAApi.queries.getDropoutSummaries,
  });
  const summary = query.data?.find((item) => item.groupId === groupId);

  return (
    <PageWrapper as="main" className="min-h-screen items-center">
      <Header
        title={
          summary?.name ??
          (groupName && toTitleCase(groupName)) ??
          "Analyse du décrochage"
        }
        description="Dernier traitement IA terminé pour ce groupe"
      >
        <Link to="/admin/group" className="btn btn-outline btn-sm">
          <ArrowLeft className="size-4" /> Groupes
        </Link>
      </Header>
      <section className="w-full" aria-label="Analyse IA du groupe">
        {query.isPending ? (
          <LoadingSkeleton variant="rows" label="Chargement de l’analyse" />
        ) : query.isError ? (
          <BoxWrapper className="h-auto">
            <p role="alert">Impossible de charger l’analyse de ce groupe.</p>
          </BoxWrapper>
        ) : summary ? (
          <div className="grid gap-4 sm:grid-cols-2">
            <BoxWrapper className="h-auto">
              <Users className="size-6 text-primary" aria-hidden="true" />
              <p className="text-sm">Apprenants analysés</p>
              <strong className="text-3xl">{summary.analyzed}</strong>
            </BoxWrapper>
            <BoxWrapper className="h-auto">
              <Brain className="size-6 text-primary" aria-hidden="true" />
              <p className="text-sm">Cas critiques</p>
              <strong className="text-3xl">{summary.critical}</strong>
            </BoxWrapper>
            <p className="text-sm text-base-content/70 sm:col-span-2">
              Traitement terminé le{" "}
              {new Date(summary.completedAt).toLocaleString("fr-FR")}
            </p>
          </div>
        ) : (
          <BoxWrapper className="h-auto">
            <p>Aucun traitement terminé pour ce groupe.</p>
          </BoxWrapper>
        )}
      </section>
    </PageWrapper>
  );
}

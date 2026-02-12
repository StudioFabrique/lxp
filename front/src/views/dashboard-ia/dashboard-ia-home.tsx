import Header from "../../components/UI/header";
import Wrapper from "../../components/UI/wrapper/wrapper.component";
import useDashboardIA from "./hooks/useDashboardIA";

export default function DashboardIAHome() {
  const { totalTokens } = useDashboardIA();

  return (
    <main className="w-full min-h-screen flex flex-col items-center gap-y-4">
      <Header
        title="Tableau de bord IA"
        description="Consultez les statistiques de consommation de l'IA par vos apprenants."
      ></Header>
      <section className="flex justify-start w-full">
        <Wrapper>
          <article className="flex gap-x-2 items-center">
            <h2 className="font-semibold">Tokens consommés</h2>
            <h3 className="text-lg font-bold text-primary">{totalTokens}</h3>
          </article>
        </Wrapper>
      </section>
    </main>
  );
}

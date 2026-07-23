import Header from "../../../../components/headers/Header";

function ModuleHeader() {
  return (
    <section className="w-full">
      {/* Main header component with title and description */}
      <Header
        title="Liste des modules"
        description="Gérer tous les modules qui sont créés au sein de l'application."
      ></Header>
    </section>
  );
}

export default ModuleHeader;

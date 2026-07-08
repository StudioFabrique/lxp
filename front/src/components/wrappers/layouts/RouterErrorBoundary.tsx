import { useRouteError } from "react-router";

const RouterErrorBoundary = () => {
  const error = useRouteError();
  console.error("Erreur de routage capturée :", error);
  return (
    <div>
      Oups, une erreur inattendue est survenue lors du chargement de cette page.
    </div>
  );
};

export default RouterErrorBoundary;

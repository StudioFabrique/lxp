import noAccessImage from "../../assets/images/no-access.jpg";

const NoAccessPage = () => {
  return (
    <div className="w-screen h-screen flex flex-col justify-center items-center gap-y-16">
      <h2 className="text-2xl font-bold">
        Vous n'avez pas accès à cette page!
      </h2>
      <img src={noAccessImage} alt="no access" />
      <h2>( Rapprochez-vous d'un administrateur pour obtenir l'accès. )</h2>
    </div>
  );
};

export default NoAccessPage;

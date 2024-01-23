import { ArrowUpRight } from "lucide-react";

/**
 * Composant parent de la route /features
 * Sert à rediriger l'utilisateur quand une fonctionnalité n'existe pas
 * et affiche la description de cette fonctionnalité ainsi que la liste
 * de toutes les fonctionnalités à venir
 */
const FeaturesList = () => {
  return (
    <div className="flex flex-col ">
      <div className="h-20 bg-black mt-10 mx-10">{/* Top Bar */}</div>
      <div className="grid grid-rows-5 gap-5 p-20">
        <div className="flex flex-col row-span-2 items-center gap-y-10 justify-center h-full bg-secondary py-16 rounded-lg">
          <p className="font-bold text-5xl">Page non trouvée</p>
          <p className="font-semibold w-[40%] text-center">
            Oups ! Il semble que vous ayez trouvé une page qui n'existe pas...
            Mais ne vous inquiétez pas, l'apprentissage continue !
          </p>
        </div>
        <div className="grid grid-cols-5 row-span-2 gap-5">
          <div className="bg-secondary rounded-lg col-span-3 px-10 py-5">
            <p className="font-semibold text-secondary-content">
              Fonctionnalités à venir
            </p>
          </div>
          <div className="bg-primary rounded-lg col-span-2 px-10 py-5">
            <p className="font-semibold text-white">Annonces</p>
          </div>
        </div>
        <div className="flex justify-between items-center bg-primary row-span-1 rounded-lg px-10 py-5">
          <p className="text-white prose">
            Nous travaillons constamment pour améliorer votre expérience
            d'apprentissage. Si vous avez des questions ou besoin d'aide,
            n'hésitez pas à nous contacter
          </p>
          <div className="flex gap-5 items-center text-white">
            <p className="text-lg">Retour à l'accueil</p>
            <ArrowUpRight className="h-14 w-14 stroke-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FeaturesList;

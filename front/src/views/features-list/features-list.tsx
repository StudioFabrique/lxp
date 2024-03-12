import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import features from "../../lib/features/features-to-be-implemented.json";
import announcements from "../../lib/features/announcements.json";
import { useEffect } from "react";
import UserTopBar from "../../components/UI/user-top-bar/user-top-bar";

/**
 * Composant parent de la route /features
 * Sert à rediriger l'utilisateur quand une fonctionnalité n'existe pas
 * et affiche la description de cette fonctionnalité ainsi que la liste
 * de toutes les fonctionnalités à venir
 */
const FeaturesList = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="flex flex-col mt-10">
      <UserTopBar />
      <div className="grid grid-rows-5 gap-5 p-20">
        <div className="flex flex-col row-span-2 items-center gap-y-5 justify-center h-full bg-secondary text-secondary-content p-20 rounded-lg">
          <p className="font-bold text-6xl">Disponible bientôt</p>
          <p className="font-semibold w-[60%] text-center">
            Oups ! Il semble que vous ayez trouvé une page qui n'existe pas...
            Mais ne vous inquiétez pas, l'apprentissage continue !
          </p>
        </div>
        <div className="grid grid-cols-5 row-span-2 gap-5">
          <div className="bg-secondary text-secondary-content rounded-lg col-span-3 px-14 py-5">
            <p className="font-semibold">Fonctionnalités à venir</p>
            <ul className="mt-5 list-disc">
              {features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </div>
          <div className="bg-primary text-primary-content rounded-lg col-span-2 px-14 py-5">
            <p className="font-semibold">Annonces</p>
            <ul className="mt-5 list-disc">
              {announcements.map((announcement) => (
                <li key={announcement}>{announcement}</li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex justify-between items-center bg-primary row-span-1 rounded-lg px-16 h-[80%]">
          <p className="text-white prose">
            Nous travaillons constamment pour améliorer votre expérience
            d'apprentissage. Si vous avez des questions ou besoin d'aide,
            n'hésitez pas à nous contacter
          </p>
          <div className="flex items-center text-white">
            <Link to="/" className="text-lg">
              Retour à l'accueil
            </Link>
            <ArrowUpRight className="h-14 w-14 stroke-1" />
          </div>
        </div>
      </div>
    </div>
  );
};
export default FeaturesList;

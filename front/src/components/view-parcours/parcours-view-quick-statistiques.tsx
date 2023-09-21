const ParcoursViewQuickStatistiques = () => {
  return (
    <div className="grid grid-cols-5 gap-x-10 mt-5">
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Diplôme</p>
        <p className="font-bold text-4xl">Bac +3</p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Étudiants</p>
        <p className="font-bold text-4xl">19</p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Semaines</p>
        <p className="font-bold text-4xl">12</p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Heures</p>
        <p className="font-bold text-4xl">457</p>
      </div>
      <div className="flex flex-col gap-y-5 items-center bg-secondary p-10 rounded-lg">
        <p className="font-bold text-xl">Modalité</p>
        <p className="font-bold text-4xl">Hybride</p>
      </div>
    </div>
  );
};

export default ParcoursViewQuickStatistiques;

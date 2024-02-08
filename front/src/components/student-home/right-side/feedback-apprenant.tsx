const FeedbackApprenant = () => {
  return (
    <div className="flex flex-col items-center justify-between bg-secondary rounded-lg p-5 gap-5">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <span className="w-full bg-indigo-200 rounded-lg p-2">
        <p className="font-semibold">Jean Marc DUPONT</p>
        <p>vient de terminer le cours 5</p>
      </span>
      <span className="w-full bg-indigo-200 rounded-lg p-2">
        <p className="font-semibold">Stanley FROGATE</p>
        <p>vient d'ajouter un commentaire</p>
      </span>
      <span className="w-full bg-indigo-200 rounded-lg p-2">
        <p className="font-semibold">Clementine ORANGER</p>
        <p>a obtenu 10/10 dans le quizz</p>
      </span>
    </div>
  );
};

export default FeedbackApprenant;

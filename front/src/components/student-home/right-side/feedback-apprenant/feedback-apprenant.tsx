const FeedbackApprenant = () => {
  return (
    <div className="flex flex-col items-center bg-secondary text-secondary-content rounded-lg p-5 gap-5 h-[350px]">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        {/* map item */}
        <p>Aucun feedback</p>
      </div>
    </div>
  );
};

export default FeedbackApprenant;

const FeelingFeedback = () => {
  return (
    <div className="flex flex-col bg-secondary p-5 rounded-lg">
      <p className="font-bold">Comment vous sentez-vous aujourd'hui ?</p>
      <button
        type="button"
        className="btn btn-xs self-end btn-primary text-white"
      >
        Envoyer
      </button>
    </div>
  );
};

export default FeelingFeedback;

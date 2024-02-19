import imageProfileReplacement from "../../../config/image-profile-replacement";

const FeedbackApprenant = () => {
  return (
    <div className="flex flex-col items-center bg-secondary text-secondary-content rounded-lg p-5 gap-5 h-[350px]">
      <p className="font-bold self-start">Derniers feedback des apprenants</p>
      <div className="flex flex-col w-full gap-5 carousel carousel-vertical">
        <div className="flex gap-4 items-center w-full bg-primary text-primary-content rounded-lg p-2 tooltip tooltip-right">
          <img
            className="rounded-lg h-[35px] w-[35px] object-cover"
            src={`data:image/jpeg;base64,${imageProfileReplacement}`}
            alt="User Avatar"
          />
          <span className="flex flex-col items-start">
            <p className="font-semibold">Stanley FROGATE</p>
            <p>vient d'ajouter un commentaire</p>
          </span>
        </div>
        <div className="flex gap-4 items-center w-full bg-primary text-primary-content rounded-lg p-2 tooltip tooltip-right">
          <img
            className="rounded-lg h-[35px] w-[35px] object-cover"
            src={`data:image/jpeg;base64,${imageProfileReplacement}`}
            alt="User Avatar"
          />
          <span className="flex flex-col items-start">
            <p className="font-semibold">Stanley FROGATE</p>
            <p>vient d'ajouter un commentaire</p>
          </span>
        </div>
        <div className="flex gap-4 items-center w-full bg-primary text-primary-content rounded-lg p-2 tooltip tooltip-right">
          <img
            className="rounded-lg h-[35px] w-[35px] object-cover"
            src={`data:image/jpeg;base64,${imageProfileReplacement}`}
            alt="User Avatar"
          />
          <span className="flex flex-col items-start">
            <p className="font-semibold">Stanley FROGATE</p>
            <p>vient d'ajouter un commentaire</p>
          </span>
        </div>
        <div className="flex gap-4 items-center w-full bg-primary text-primary-content rounded-lg p-2 tooltip tooltip-right">
          <img
            className="rounded-lg h-[35px] w-[35px] object-cover"
            src={`data:image/jpeg;base64,${imageProfileReplacement}`}
            alt="User Avatar"
          />
          <span className="flex flex-col items-start">
            <p className="font-semibold">Stanley FROGATE</p>
            <p>vient d'ajouter un commentaire</p>
          </span>
        </div>
      </div>
    </div>
  );
};

export default FeedbackApprenant;

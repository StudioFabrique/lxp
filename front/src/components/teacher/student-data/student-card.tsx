import imageProfileReplacement from "../../../config/image-profile-replacement";

interface StudentCardProps {
  avatar?: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  parcours: string | null;
  status: string;
}

export default function StudentCard(props: StudentCardProps) {
  return (
    <div className="capitalize w-full flex lg:flex-col lg:justify-center flex-row gap-x-4 gap-y-2 text-xs">
      <div className="avatar">
        <div className="w-24 rounded-xl">
          <img
            className="h-full w-full rounded-lg object-cover"
            src={`data:image/jpeg;base64,${
              props.avatar ?? imageProfileReplacement
            }`}
            alt={`avatar de ${props.firstname} ${props.lastname}`}
          />
        </div>
      </div>

      <div className="flex justify-between">
        <span className="flex flex-col gap-y-2">
          <span className="flex gap-x-2">
            <p className="font-bold">Nom :</p>
            <span className="text-info">{props.lastname}</span>
          </span>
          <span className="flex gap-x-2">
            <p className="font-bold">Prénom :</p>
            <span className="text-info">{props.firstname}</span>
          </span>
          <span className="flex gap-x-2">
            <p className="font-bold whitespace-nowrap">Adresse mail : </p>
            <span className="lowercase text-info">{props.email}</span>
          </span>
          <span className="flex gap-x-2">
            <p className="font-bold">Téléphone :</p>
            <span className="text-info">
              {props.phoneNumber.length > 0
                ? props.phoneNumber
                : "Non Renseigné"}
            </span>
          </span>
          <span className="flex gap-x-2">
            <p className="font-bold">Parcours :</p>
            <span className="text-info">{props.parcours}</span>
          </span>
          <span className="flex gap-x-2">
            <p className="font-bold ">Statut :</p>
            <span className="text-info">{props.status}</span>
          </span>
        </span>
      </div>
    </div>
  );
}

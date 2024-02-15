import imageProfileReplacement from "../../../config/image-profile-replacement";

interface StudentCardProps {
  avatar?: string;
  firstname: string;
  lastname: string;
  email: string;
  phoneNumber: string;
  parcours: string;
  status: string;
}

export default function StudentCard(props: StudentCardProps) {
  return (
    <div className="capitalize flex flex-col gap-y-2">
      <div className="avatar mb-2">
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

      <span className="flex gap-x-4">
        <p className="font-bold">Nom :</p>
        <p>{props.lastname}</p>
      </span>
      <span className="flex gap-x-4">
        <p className="font-bold">Prénom :</p>
        <p>{props.firstname}</p>
      </span>
      <span className="flex gap-x-4">
        <p className="font-bold">Adresse mail : </p>
        <p className="lowercase">{props.email}</p>
      </span>
      <span className="flex gap-x-4">
        <p className="font-bold">Téléphone :</p>
        <p>{props.phoneNumber}</p>
      </span>
      <span className="flex gap-x-4">
        <p className="font-bold">Parcours :</p>
        <p>{props.parcours}</p>
      </span>
      <span className="flex gap-x-4">
        <p className="font-bold">Satut :</p>
        <p>{props.status}</p>
      </span>
    </div>
  );
}

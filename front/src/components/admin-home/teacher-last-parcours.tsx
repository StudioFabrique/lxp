import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import Parcours from "../../utils/interfaces/parcours";
import toast from "react-hot-toast";
import ParcoursItem from "./parcours-item";
import { Loader2 } from "lucide-react";

export default function TeacherLastParcours() {
  const { sendRequest, isLoading, error } = useHttp();
  const [parcours, setParcours] = useState<Parcours[] | null>(null);

  // retourne les deux parcours auquel l'utilisateur est associé en tant que contact
  const getParcours = useCallback(() => {
    const applyData = (data: {
      message: string;
      success: boolean;
      response: Parcours[];
    }) => {
      console.log(data);
      setParcours(data.response);
    };
    sendRequest(
      {
        path: "/user/last-parcours",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    getParcours();
  }, [getParcours]);

  // gère les erreurs HTTP
  useEffect(() => {
    if (error.length > 0) {
      toast.error(error);
    }
  }, [error]);

  const style =
    parcours && parcours?.length > 1
      ? "grid grid-cols-2 gap-2"
      : "grid grid-cols-1 gap-2";

  return (
    <>
      {isLoading && !parcours ? (
        <div className="w-full h-[12rem] flex justify-center items-center">
          <Loader2 className="animate-spin text-primary" />
        </div>
      ) : null}

      {parcours && parcours.length > 0 ? (
        <ul className={style}>
          {parcours.map((item) => (
            <li key={item.id}>
              <ParcoursItem parcours={item} />
            </li>
          ))}
        </ul>
      ) : null}
    </>
  );
}

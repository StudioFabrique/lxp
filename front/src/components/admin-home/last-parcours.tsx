import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import ParcoursTable from "./parcours-table";
import ParcoursSummary from "../../utils/interfaces/parcours-summary";
import { Link } from "react-router-dom";
import { MoveUpRight } from "lucide-react";

export default function LastParcours() {
  const [parcours, setParcours] = useState<ParcoursSummary[] | null>(null);
  const { sendRequest } = useHttp();

  const getParcours = useCallback(() => {
    const applyData = (data: ParcoursSummary[]) => {
      console.log(data);
      setParcours(data);
    };
    sendRequest(
      {
        path: "/parcours/root-parcours",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    getParcours();
  }, [getParcours]);

  return (
    <div className="p-5 rounded-lg bg-primary flex flex-col justify-center items-center gap-y-2">
      {parcours && parcours.length > 0 ? (
        <ParcoursTable parcoursList={parcours} />
      ) : null}
      <div className="w-full flex justify-end text-white pr-4">
        <Link
          className="text-xs font-bold flex items-center gap-x-2"
          to="/admin/parcours"
        >
          Voir plus <MoveUpRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

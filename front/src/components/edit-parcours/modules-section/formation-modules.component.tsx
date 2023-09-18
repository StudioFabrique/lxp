import { useEffect } from "react";
import useHttp from "../../../hooks/use-http";
import { useSelector } from "react-redux";

const FormationModule = () => {
  const { sendRequest } = useHttp();
  //const [formationModules, setFormationModule] = useState<any>([]);
  const parcoursId = useSelector((state: any) => state.parcours.id);

  useEffect(() => {
    const applyData = (data: any) => {
      console.log(data);
    };
    sendRequest(
      {
        path: `/module/formation/${parcoursId}`,
      },
      applyData
    );
  }, [parcoursId, sendRequest]);

  return <div></div>;
};

export default FormationModule;

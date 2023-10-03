import { useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";

const ParcoursHome = () => {
  const [image, setImage] = useState<any>(null);
  const { sendRequest } = useHttp();

  useEffect(() => {
    const applyData = (data: any) => {
      console.log({ data });

      setImage(data);
    };
    sendRequest(
      {
        path: "/parcours",
      },
      applyData
    );
  }, [sendRequest]);

  return <img src={`data:image/png;base64,${image}`} alt="Parcours" />;
};

export default ParcoursHome;

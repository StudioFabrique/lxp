import { useCallback, useEffect, useState } from "react";
import useHttp from "../../hooks/use-http";
import CardMedia from "../../components/mediatheque/card-media";

function MediathequeHomePage() {
  const { sendRequest } = useHttp();
  const [medias, setMedias] = useState([]);

  const getData = useCallback(() => {
    const applyData = (data: any) => {
      setMedias(data.medias);
    };
    sendRequest(
      {
        path: "/media/images",
      },
      applyData
    );
  }, [sendRequest]);

  useEffect(() => {
    getData();
  }, [getData]);

  return (
    <div>
      <h1>Mediathèque</h1>
      {medias && medias.length > 0 ? (
        <ul className="flex flex-wrap gap-4">
          {medias.map((media: any) => (
            <li key={media.id}>
              <CardMedia media={media} />
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}

export default MediathequeHomePage;

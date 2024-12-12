import { Media } from "../hooks/use-check-media";

type Props = {
  media: Media;
};

function CheckMediaResult({ media }: Props) {
  return (
    <div className="modal modal-open" role="dialog">
      <div className="modal-box">
        <h2>
          Un fichier <p>{media.type}</p> avec ce nom existe déja
        </h2>
      </div>
    </div>
  );
}

export default CheckMediaResult;

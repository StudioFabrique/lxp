
import { ACTIVITIES } from "../../../config/urls";
import { bgImageGradient } from "../../../utils/helpers/color-helpers";
import Media from "../interfaces/media";

type Props = {
  media: Media;
};

function ImageCard({ media }: Props) {
  const classImage: React.CSSProperties = {
    backgroundImage: bgImageGradient(ACTIVITIES + "images/" + media.url),

    width: "100%",
    height: "8rem",
    backgroundSize: "cover",
    backgroundRepeat: "no-repeat",
    backgroundPosition: "center",
    position: "relative",
  };

  return <figure style={classImage}></figure>;
}

export default ImageCard;

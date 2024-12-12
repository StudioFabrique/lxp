import { ACTIVITIES } from "../../config/urls";

type Props = {
  media: any;
};

function CardMedia({ media }: Props) {
  return (
    <div className="card glass w-96">
      <figure>
        <img src={ACTIVITIES + "images/" + media.url} alt="car!" />
      </figure>
      <div className="card-body">
        <h2 className="card-title">Life hack</h2>
        <p>How to park your car at your garage?</p>
        <div className="card-actions justify-end">
          <button className="btn btn-primary">Learn now!</button>
        </div>
      </div>
    </div>
  );
}

export default CardMedia;

import { Star } from "lucide-react";

type RatingWithStarsProps = {
  selectedStars: number;
  onSelectStarRate: (rating: number) => void;
};

const RatingWithStars = ({
  selectedStars,
  onSelectStarRate,
}: RatingWithStarsProps) => (
  <div className="flex gap-2 my-3 justify-center">
    {[1, 2, 3, 4, 5].map((item) => (
      <Star
        size={24}
        key={item}
        onClick={() => onSelectStarRate(item)}
        className={`cursor-pointer transition-all duration-200 hover:scale-110 ${
          item <= selectedStars
            ? "fill-primary scale-105 stroke-1"
            : "stroke-base-content/50 stroke-1 hover:stroke-1"
        }`}
      />
    ))}
  </div>
);

export default RatingWithStars;

import { cn } from "../../utils/cn";

type Props = {
  className?: string;
};

/** Titre de la présentation. */
const IntroSceneHeading = ({ className }: Props) => (
  <h1
    id="intro-presentation-title"
    className={cn("text-2xl font-bold leading-tight", className)}
  >
    Comment s'organisent vos contenus ?
  </h1>
);

export default IntroSceneHeading;

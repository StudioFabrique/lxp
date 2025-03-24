import {
  Baby,
  Banana,
  Bed,
  BoomBox,
  Candy,
  Cat,
  Citrus,
  Coffee,
  Dog,
  Gamepad2,
  Ghost,
  Guitar,
  HandMetal,
  MountainSnow,
  Piano,
  Pizza,
  Rabbit,
  Rat,
  Sailboat,
  TentTree,
  Tractor,
  Turtle,
} from "lucide-react";
import Wrapper from "../../UI/wrapper/wrapper.component";
import { PropsWithChildren } from "react";
import FadeWrapper from "../../UI/fade-wrapper/fade-wrapper";

const NoActivityPlaceholder = ({ children }: PropsWithChildren) => {
  const showLucideIcon = () => {
    const iconClassName = "w-40 h-40 text-primary";
    const randomNumber = Math.floor(Math.random() * 21);

    switch (randomNumber) {
      case 0:
        return <Coffee className={iconClassName} />;
      case 1:
        return <Pizza className={iconClassName} />;
      case 2:
        return <Bed className={iconClassName} />;
      case 3:
        return <Ghost className={iconClassName} />;
      case 4:
        return <Cat className={iconClassName} />;
      case 5:
        return <Dog className={iconClassName} />;
      case 6:
        return <BoomBox className={iconClassName} />;
      case 7:
        return <Baby className={iconClassName} />;
      case 8:
        return <Gamepad2 className={iconClassName} />;
      case 9:
        return <Banana className={iconClassName} />;
      case 10:
        return <Candy className={iconClassName} />;
      case 11:
        return <Citrus className={iconClassName} />;
      case 12:
        return <Tractor className={iconClassName} />;
      case 13:
        return <Turtle className={iconClassName} />;
      case 14:
        return <TentTree className={iconClassName} />;
      case 15:
        return <Sailboat className={iconClassName} />;
      case 16:
        return <Rat className={iconClassName} />;
      case 17:
        return <Rabbit className={iconClassName} />;
      case 18:
        return <Piano className={iconClassName} />;
      case 19:
        return <MountainSnow className={iconClassName} />;
      case 20:
        return <Guitar className={iconClassName} />;
      case 21:
        return <HandMetal className={iconClassName} />;
      default:
        return <BoomBox className={iconClassName} />;
    }
  };

  return (
    <div className="items-center bg-secondary/5 p-10 rounded-lg">
      <FadeWrapper>
        <div className="flex flex-col gap-10">
          {showLucideIcon()}
          <p className="text-2xl font-bold text-primary">Aucune activité</p>
          {children}
        </div>
      </FadeWrapper>
    </div>
  );
};

export default NoActivityPlaceholder;

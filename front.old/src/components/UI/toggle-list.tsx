import CardsIcon from "./svg/cards-icon";
import ListIcon from "./svg/list-icon";

interface ToggleListProps {
  showList: boolean;
  onToggle: (value: boolean) => void;
}

const ToggleList = ({ showList, onToggle }: ToggleListProps) => {
  const baseStyle = "w-8 h-8 cursor-pointer";
  const selectedStyle = "w-8 h-8 border-b-2 border-primary cursor-pointer";

  return (
    <ul className="flex gap-x-2">
      <li>
        <div
          className="tooltip tooltip-bottom"
          data-tip="Affichage sous forme de liste"
          aria-label="affiche la liste des parcours sous forme de liste"
          onClick={() => onToggle(true)}
        >
          <div className={showList ? selectedStyle : baseStyle}>
            <ListIcon />
          </div>
        </div>
      </li>
      <li>
        <div
          className="tooltip tooltip-bottom"
          data-tip="Affichage sous forme de cartes"
          aria-label="affiche la liste des parcours sous forme de cartes"
          onClick={() => onToggle(false)}
        >
          <div className={showList ? baseStyle : selectedStyle}>
            <CardsIcon />
          </div>
        </div>
      </li>
    </ul>
  );
};

export default ToggleList;

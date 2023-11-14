import DeleteIcon from "./UI/svg/delete-icon.component";

interface ItemElementProps {
  item: any;
  onRemoveItem: (value: unknown) => void;
  property: string;
}

const ItemElement = (props: ItemElementProps) => {
  const handleRemoveItem = () => {
    props.onRemoveItem(props.item);
  };

  return (
    <div className="flex gap-x-2 text-xs items-center">
      <p className="capitalize flex-1">{props.item[props.property]}</p>
      <div
        className="w-4 h-4 cursor-pointer flex justify-end text-error"
        aria-label="supprimer l'objet"
        onClick={handleRemoveItem}
      >
        <div>
          <DeleteIcon />
        </div>
      </div>
    </div>
  );
};

export default ItemElement;

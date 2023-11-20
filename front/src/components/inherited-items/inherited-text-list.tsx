/* eslint-disable @typescript-eslint/no-explicit-any */
import SubWrapper from "../UI/sub-wrapper/sub-wrapper.component";
import ItemElement from "../item-element.component";

interface InheritedTextListProps {
  list?: any[];
  property?: string;
  onRemoveItem?: (item: any) => void;
  onDelete?: (id: number) => void;
}

const InheritedTextList = (props: InheritedTextListProps) => {
  const handleRemoveItem = (item: any) => {
    props.onRemoveItem!(item);
  };

  return (
    <ul className="flex flex-col gap-y-2">
      {props.list &&
        props.list.map((item: any) => (
          <li key={item.id}>
            <SubWrapper>
              <ItemElement
                item={item}
                onRemoveItem={() => handleRemoveItem(item)}
                property={props.property! ?? "name"}
              />
            </SubWrapper>
          </li>
        ))}
    </ul>
  );
};

export default InheritedTextList;

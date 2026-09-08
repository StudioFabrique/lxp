/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ReactNode } from "react";

import SubBoxWrapper from "../../wrappers/SubBoxWrapper";
import ItemElement from "./item-element.component";

interface InheritedTextListProps {
  list?: any[];
  property?: string | string[];
  additionalProperty?: string; // propriété additionnelle facultative rajouté
  onRemoveItem?: (item: any) => void;
  onDelete?: (id: number) => void;
  lockedItemIds?: number[];
  isDisabled?: boolean;
  renderAction?: (item: any) => ReactNode;
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
            <SubBoxWrapper>
              <ItemElement
                item={item}
                onRemoveItem={() => handleRemoveItem(item)}
                property={props.property! ?? "name"}
                additionalProperty={props.additionalProperty}
                removable={
                  !props.isDisabled && !props.lockedItemIds?.includes(item.id)
                }
                action={props.renderAction?.(item)}
              />
            </SubBoxWrapper>
          </li>
        ))}
    </ul>
  );
};

export default InheritedTextList;

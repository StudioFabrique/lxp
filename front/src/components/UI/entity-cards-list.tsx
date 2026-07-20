import CardListItem from "../../UI/card-list-item";
import ElementNotFound from "../../UI/element-not-found";
import { ReactNode } from "react";

export type EntityCardsListProps<T> = {
  items: T[];
  renderItem: (item: T) => ReactNode;
  emptyMessage: string;
};

export default function EntityCardsList<T extends { id: number }>({
  items,
  renderItem,
  emptyMessage,
}: EntityCardsListProps<T>) {
  return (
    <>
      {items && items.length > 0 ? (
        <CardListItem>
          {items.map((item) => (
            <li key={item.id}>{renderItem(item)}</li>
          ))}
        </CardListItem>
      ) : (
        <ElementNotFound message={emptyMessage} />
      )}
    </>
  );
}

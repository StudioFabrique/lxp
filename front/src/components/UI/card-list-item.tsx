import { ReactNode } from "react";

interface CardListItemProps {
  children: ReactNode;
}

const CardListItem = ({ children }: CardListItemProps) => {
  return (
    <div className="w-full min-h-[50%] flex justify-center items-center text-xs lg:text-sm mt-8">
      <ul className="flex flex-wrap gap-8">{children}</ul>
    </div>
  );
};

export default CardListItem;

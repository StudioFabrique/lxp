import { ReactNode } from "react";

interface CardListItemProps {
  children: ReactNode;
}

const CardListItem = ({ children }: CardListItemProps) => {
  return (
    <div className="w-full min-h-[50%] flex justify-center items-center text-xs lg:text-sm">
      <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 2xl:grid-cols-3 gap-y-8 gap-x-16 2xl:gap-x-8">
        {children}
      </ul>
    </div>
  );
};

export default CardListItem;

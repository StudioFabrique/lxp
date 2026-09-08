import React, { FC } from "react";
import { cn } from "../../utils/cn";

type Props = {
  className?: string;
  children: React.ReactNode;
  unstyled?: boolean;
};

const BoxWrapper: FC<Props> = ({
  className,
  children,
  unstyled = false,
}) => {
  return (
    <div
      className={cn(
        "relative flex h-full min-w-0 flex-col gap-y-4",
        !unstyled &&
          "rounded-lg border border-base-300 bg-base-200 p-5 shadow-sm",
        className,
      )}
    >
      {children}
    </div>
  );
};

export default BoxWrapper;

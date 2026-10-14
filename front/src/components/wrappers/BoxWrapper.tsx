import React, { ComponentPropsWithoutRef, useContext } from "react";
import { cn } from "../../utils/cn";
import { BoxWrapperNestingContext } from "./box-wrapper-nesting";

type Props = ComponentPropsWithoutRef<"div"> & {
  children: React.ReactNode;
  unstyled?: boolean;
};

const BoxWrapper = ({
  className,
  children,
  unstyled = false,
  ...props
}: Props) => {
  const isNested = useContext(BoxWrapperNestingContext);

  const box = (
    <div
      {...props}
      className={cn(
        "relative flex h-full min-w-0 flex-col gap-y-4",
        !unstyled &&
          "rounded-lg border border-base-300 p-5 shadow-sm",
        !unstyled && (isNested ? "bg-base-100/60" : "bg-base-200"),
        className,
      )}
    >
      {children}
    </div>
  );

  return unstyled ? (
    box
  ) : (
    <BoxWrapperNestingContext.Provider value>
      {box}
    </BoxWrapperNestingContext.Provider>
  );
};

export default BoxWrapper;

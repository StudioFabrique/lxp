import React, { FC } from "react";

type Props = {
  additionalClassname?: string;
  children: React.ReactNode;
  unstyled?: boolean;
};

const BoxWrapper: FC<Props> = ({
  additionalClassname = "",
  children,
  unstyled = false,
}) => {
  return (
    <div
      className={`flex min-w-0 flex-col gap-y-4 h-full relative ${
        unstyled ? "" : "p-5 rounded-lg bg-secondary/20"
      } ${additionalClassname}`}
    >
      {children}
    </div>
  );
};

export default BoxWrapper;

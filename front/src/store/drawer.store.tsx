import React, { createContext, useState, ReactNode, useCallback } from "react";

type DrawerContextProps = {
  isDrawerOpen: boolean;
  handleShowDrawer: (value: boolean) => void;
};

export const DrawerContext = createContext<DrawerContextProps>({
  isDrawerOpen: false,
  handleShowDrawer: () => {},
});

type Props = {
  children: ReactNode;
};

export const DrawerProvider: React.FC<Props> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const handleShowDrawer = useCallback((value: boolean) => {
    setIsDrawerOpen(value);
  }, []);

  return (
    <DrawerContext.Provider value={{ isDrawerOpen, handleShowDrawer }}>
      {children}
    </DrawerContext.Provider>
  );
};

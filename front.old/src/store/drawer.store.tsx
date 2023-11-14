import React, { createContext, useState, ReactNode, useCallback } from "react";

type DrawerContextProps = {
  isDrawerOpen: boolean;
  triggerId: any;
  handleShowDrawer: (value: boolean) => void;
  updateTriggerId: (value: any) => void;
};

export const DrawerContext = createContext<DrawerContextProps>({
  isDrawerOpen: false,
  triggerId: null,
  handleShowDrawer: () => {},
  updateTriggerId: () => {},
});

type Props = {
  children: ReactNode;
};

export const DrawerProvider: React.FC<Props> = ({ children }) => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [triggerId, setTriggerId] = useState(null);

  const handleShowDrawer = useCallback((value: boolean) => {
    setIsDrawerOpen(value);
  }, []);

  const updateTriggerId = useCallback((value: any) => {
    setTriggerId(value);
  }, []);

  return (
    <DrawerContext.Provider
      value={{ isDrawerOpen, triggerId, handleShowDrawer, updateTriggerId }}
    >
      {children}
    </DrawerContext.Provider>
  );
};

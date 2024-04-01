// DeviceContext.tsx
import React from "react";
import useMediaQuery from "@mui/material/useMediaQuery";
import { Theme } from "@mui/material";

interface DeviceContextType {
  isPhone: boolean;
}

const DeviceContext = React.createContext<DeviceContextType | undefined>(undefined);

export const useDeviceContext = () => {
  const context = React.useContext(DeviceContext);
  if (context === undefined) {
    throw new Error("useDeviceContext must be used within a DeviceProvider");
  }
  return context;
};

export const DeviceProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const isPhone = useMediaQuery((theme:Theme) => theme.breakpoints.down('sm'));
  return (
    <DeviceContext.Provider value={{ isPhone }}>
      {children}
    </DeviceContext.Provider>
  );
};

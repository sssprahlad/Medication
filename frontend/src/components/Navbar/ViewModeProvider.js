import React, { createContext, useContext, useState } from "react";

const ViewModeContext = createContext();

export const ViewModeProvider = ({ children }) => {
  const [buttonAction, setButtonAction] = useState(false); 
    // const [adherenceDataBoolean, setAdherenceDataBoolean] = useState(false);
//onsole.log(adherenceDataBoolean,"adherenceDataBoolean");
  return (
    <ViewModeContext.Provider value={{ buttonAction, setButtonAction }}>
      {children}
    </ViewModeContext.Provider>
  );
};

export const useViewMode = () => useContext(ViewModeContext);

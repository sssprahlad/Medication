import React, { createContext, useContext, useState } from 'react';

const ViewModeContext = createContext();

export const useViewMode = () => {
  const context = useContext(ViewModeContext);
  if (context === undefined) {
    throw new Error('useViewMode must be used within a ViewModeProvider');
  }
  return context;
};

export const ViewModeProvider = ({ children }) => {
  const [buttonAction, setButtonAction] = useState(false);
  // const [adherenceDataBoolean, setAdherenceDataBoolean] = useState(false);
  // console.log(adherenceDataBoolean,"adherenceDataBoolean");

  return (
    <ViewModeContext.Provider value={{ 
      buttonAction, 
      setButtonAction,
      // adherenceDataBoolean,
      // setAdherenceDataBoolean,

    }}>
      {children}
    </ViewModeContext.Provider>
  );
};

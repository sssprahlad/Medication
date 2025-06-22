import React, { createContext, useState, useContext } from 'react';

const MedicationContext = createContext();

export const MedicationProvider = ({ children }) => {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [medicationData, setMedicationData] = useState({});
  const [checkedDateBoolean, setCheckedDateBoolean] = useState(false);
  // const [adherenceDataBoolean, setAdherenceDataBoolean] = useState(false);    

  
  

  const handleDateChange = (date) => {
    setSelectedDate(date);

    console.log('Selected date:', date);
  };

  return (
    <MedicationContext.Provider
      value={{
        selectedDate,
        medicationData,
        handleDateChange,
        setMedicationData,
        checkedDateBoolean,
        setCheckedDateBoolean,
     
       
          }}
    >
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedication = () => {
  const context = useContext(MedicationContext);
  if (!context) {
    throw new Error('useMedication must be used within a MedicationProvider');
  }
  return context;
};

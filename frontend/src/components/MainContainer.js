import React from "react";
import Navbar from "./Navbar/Navbar";
import "./MainContainer.css";
import { useViewMode } from "./Navbar/ViewModeProvider";
import PatientMainContainer from "./ParentContainer/PatientMainContainer/PatientMainContainer";
import CareTakerMainContainer from "./ParentContainer/CareTakerMainContainer/CareTakerMainContainer";
import { MedicationProvider } from "../contexts/MedicationContext";

const MainContainer = () => {
  const { buttonAction } = useViewMode();

  return (
    <div>
      <Navbar />
      <div className="active-container">
         <MedicationProvider>
         {buttonAction ? <PatientMainContainer /> : <CareTakerMainContainer />}
                </MedicationProvider>
       
      </div>
    </div>
  );
};

export default MainContainer;

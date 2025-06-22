import React from "react";
import CareTaker from "../../CareTaker/CareTaker";
import "./CareTakerMainContainer.css";
import Tabs from "../../Tabs/Tab";

const CareTakerMainContainer = () => {
  return (
    <div>
      <CareTaker />
      <div className="tab-container">
      <Tabs />
      </div>
    </div>
  );
};

export default CareTakerMainContainer;

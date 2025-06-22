import React, { useEffect, useState } from "react";
import "./CareTaker.css";
import { useSelector } from "react-redux";

const CareTaker = () => {
  const [data, setData] = useState({adherence_rate: 0, current_streak: 0, missed_this_month: 0, taken_this_week: 0});
 const adherenceDataBoolean = useSelector((state) => state.adherenceDataBoolean);
 const user_name = localStorage.getItem("user_name"); 
  console.log(data,adherenceDataBoolean,"data");
  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/adherence");
    const result = await response.json();
    const lastItem = result[result.length - 1];
    setData({
      adherence_rate: lastItem.adherence_rate,
      current_streak: lastItem.current_streak,
      missed_this_month: lastItem.missed_this_month,
      taken_this_week: lastItem.taken_this_week,
    });
  };
  
  useEffect(() => {
    fetchData(); 
  }, []);
  
  

  

  return (
    <div className="">
      <div class="dashboard-container">
        <div class="header">
          <div class="icon-box">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"></path>
              <circle cx="9" cy="7" r="4"></circle>
              <path d="M22 21v-2a4 4 0 0 0-3-3.87"></path>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
            </svg>
          </div>
          <div class="title-container">
            <h2>Caretaker Dashboard</h2>
            <p>Monitoring {user_name} medication adherence</p>
          </div>
        </div>

        <div class="care-taker-grid-container">
          <div class="sub-box-container">
            <div class="value-text">{data.adherence_rate}%</div>
            <div class="label-text">Adherence Rate</div>
          </div>
          <div class="sub-box-container">
            <div class="value-text">{data.current_streak}</div>
            <div class="label-text">Current Streak</div>
          </div>
          <div class="sub-box-container">
            <div class="value-text">{data.missed_this_month}</div>
            <div class="label-text">Missed This Month</div>
          </div>
          <div class="sub-box-container">
            <div class="value-text">{data.taken_this_week}</div>
            <div class="label-text">Taken This Week</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CareTaker;

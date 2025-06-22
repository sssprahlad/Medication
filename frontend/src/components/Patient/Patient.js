import React, { useState, useEffect } from "react";
import "./Patient.css";

const Patient = () => {
  const [data, setData] = useState({day_streak: 3, today_status: 1, monthly_rate: 80});

 
  const fetchData = async () => {
    const response = await fetch("http://localhost:3000/medication");
    const result = await response.json();

    if (Array.isArray(result) && result.length > 0) {
      const lastItem = result[result.length - 1]; 
      setData({
        day_streak: lastItem.day_streak,
        today_status: lastItem.today_status,
        monthly_rate: lastItem.monthly_rate,
      });
    }
  };
   
    useEffect(() => {
      fetchData()
       
    }, []);

    
 
  

  return (
    <div>
      <div class="patient-dashboard">
        <div class="card-header">
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
              <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
              <circle cx="12" cy="7" r="4" />
            </svg>
          </div>
          <div className="patient-text-container">
            <h2>Good Afternoon!</h2>
            <p>Ready to stay on track with your medication?</p>
          </div>
        </div>

        <div class="patient-grid-container">
          <div class="sub-box-container">
            <div class="stat-value">{data.day_streak}</div>
            <div class="label-text">Day Streak</div>
          </div>
          <div class="sub-box-container">
            <div class="value-text">{data.today_status}</div>
            <div class="label-text">Today's Status</div>
          </div>
          <div class="sub-box-container">
            <div class="value-text">{data.monthly_rate}%</div>
            <div class="label-text">Monthly Rate</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Patient;

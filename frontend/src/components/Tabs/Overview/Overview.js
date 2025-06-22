import React, { useEffect, useState } from "react";
import "./Overview.css";

const Overview = () => {
   const [data, setData] = useState({adherence_rate: 0, current_streak: 0, missed_this_month: 0, taken_this_week: 0});


      const fetchData = async () => {
        const response = await fetch("https://medication-ugnu.onrender.com/adherence");
        const result = await response.json();
        console.log(result,"result");
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
        <div className="overview-container">
           <div className="today-status-container">
           
    <div className="dashboard-grid">
   
      <div className="card">
        <div className="card-header">
          <h3 className="card-title with-icon">
            <svg className="icon blue" viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2v4" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            </svg>
            Today's Status
          </h3>
        </div>
        <div className="card-body">
          <div className="status-row">
            <div>
              <h4 className="medication-title">Daily Medication Set</h4>
              <p className="medication-time">8:00 AM</p>
            </div>
            <div className="status-badge pending">Pending</div>
          </div>
        </div>
      </div>

    
      <div className="card">
        <div className="card-header">
          <h3 className="card-title">Quick Actions</h3>
        </div>
        <div className="card-body space-buttons">
          <button className="action-button">
            <svg className="icon" viewBox="0 0 24 24" fill="none">
              <rect x="2" y="4" width="20" height="16" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M22 7 13.03 12.7a1.94 1.94 0 0 1-2.06 0L2 7" stroke="currentColor" strokeWidth="2" />
            </svg>
            Send Reminder Email
          </button>
          <button className="action-button">
            <svg className="icon" viewBox="0 0 24 24" fill="none">
              <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" stroke="currentColor" strokeWidth="2" />
              <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" stroke="currentColor" strokeWidth="2" />
            </svg>
            Configure Notifications
          </button>
          <button className="action-button">
            <svg className="icon" viewBox="0 0 24 24" fill="none">
              <path d="M8 2v4" stroke="currentColor" strokeWidth="2" />
              <path d="M16 2v4" stroke="currentColor" strokeWidth="2" />
              <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
              <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
            </svg>
            View Full Calendar
          </button>
        </div>
      
        </div>
        </div>
      
           
           <div className="progress-card-container">
      <div className="progress-header">
        <h3 className="progress-title">Monthly Adherence Progress</h3>
      </div>

      <div className="progress-body">
        <div className="progress-top">
          <span>Overall Progress</span>
          <span>{data.adherence_rate}%</span>
        </div>

        <div
          className="progress-bar-container"
          role="progressbar"
          aria-valuemin={0}
          aria-valuemax={100}
          aria-valuenow={ Number(data.adherence_rate)}
        >
          <div
            className="progress-bar-fill"
            style={{ width: `${Number(data.adherence_rate)}%` }}
          ></div>
        </div>

        <div className="progress-grid">
          <div>
            <div className="progress-count green">{data.taken_this_week} days</div>
            <div className="progress-label">Taken</div>
          </div>
          <div>
            <div className="progress-count red">{data.missed_this_month} days</div>
            <div className="progress-label">Missed</div>
          </div>
          <div>
            <div className="progress-count blue">{data.current_streak} days</div>
            <div className="progress-label">Remaining</div>
          </div>
        </div>
      </div>
    </div>
    </div>
    </div>
    
     
    );
};

export default Overview;
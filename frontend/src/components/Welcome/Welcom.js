import React from "react";
import "./Welcome.css";
import { useNavigate } from "react-router-dom";
import { useViewMode } from "../Navbar/ViewModeProvider";

const Welcome = () => {
  const navigate = useNavigate();
  const { buttonAction, setButtonAction } = useViewMode();
  return (
    <div className="welcome-container">
   
    <div className="role-wrapper">
      <div className="role-container">
        <div className="role-header">
          <div className="role-icon-bg">
            <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
              <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"></path>
            </svg>
          </div>
          <h1>Welcome to MediCare Companion</h1>
          <p>Your trusted partner in medication management. Choose your role to get started with personalized features.</p>
        </div>

        <div className="role-grid">
          <div className="role-card blue sm">
            <div className="role-card-header">
              <div className="role-avatar blue-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#2563eb" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <h3>I'm a Patient</h3>
              <p>Track your medication schedule and maintain your health records</p>
            </div>
            <ul className="role-list">
              <li>Mark medications as taken</li>
              <li>Upload proof photos (optional)</li>
              <li>View your medication calendar</li>
              <li>Large, easy-to-use interface</li>
            </ul>
            <button onClick={() => {setButtonAction(!buttonAction); navigate("/home")}} className="blue-btn">Continue as Patient</button>
          </div>

          <div className="role-card green">
            <div className="role-card-header">
              <div className="role-avatar green-bg">
                <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="none" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </div>
              <h3>I'm a Caretaker</h3>
              <p>Monitor and support your loved one's medication <br /> adherence</p>
            </div>
            <ul className="role-list">
              <li>Monitor medication compliance</li>
              <li>Set up notification preferences</li>
              <li>View detailed reports</li>
              <li>Receive email alerts</li>
            </ul>
            <button onClick={() => {setButtonAction(!buttonAction); navigate("/home")}} className="green-btn">Continue as Caretaker</button>
          </div>
        </div>

        <div className="role-footer">
          <p>You can switch between roles anytime after setup</p>
        </div>
      </div>
    </div>
    </div>
  );
};

export default Welcome;

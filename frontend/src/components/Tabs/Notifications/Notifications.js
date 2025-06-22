import React, { useEffect, useState } from "react";
import "./Notifications.css";

const Notifications = () => {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [missedAlerts, setMissedAlerts] = useState(true);
  const [alertDelay, setAlertDelay] = useState("2 hours");
  const [reminderTime, setReminderTime] = useState("20:00");
  console.log(alertDelay, reminderTime,"alertDelay")
  
  const [status, setStatus] = useState("");
  const [alertMessage, setAlertMessage] = useState(false);
  const user_name = localStorage.getItem("user_name");
  const getEmail = localStorage.getItem("email");
  const [email, setEmail] = useState(getEmail);
  const [name, setName] = useState(user_name);
  
  const [customMessage, setCustomMessage] = useState("");
  const [error, setError] = useState(false);
  console.log(reminderTime);
  console.log(alertDelay);

  useEffect(() => {
  if(name && email && customMessage){
    setError(false);
  }
}, [name, email, customMessage]);  

  const ToggleSwitch = ({ checked, onChange, id }) => (
    <label htmlFor={id} className="switch">
      <input id={id} type="checkbox" checked={checked} onChange={onChange} />
      <span className="slider"></span>
    </label>
  );

  const handleSendAlert = async () => {
    if(name && email && customMessage && reminderTime && alertDelay){
      try {
        const res = await fetch("https://medication-ugnu.onrender.com/send-alert", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
             name,
            email,
            message: customMessage,
            // alertDelay,
            // reminderTime,
          }),
        });
  
        const msg = await res.text();
        setStatus(msg);
        setAlertMessage(true);
        setCustomMessage("");
      } catch (err) {
        console.error("Error sending alert:", err);
        setStatus("Failed to send email.");
      }
    }else{
      setError(true);
    }
   
  };

  useEffect(() => {
    if (alertMessage) {
      setTimeout(() => {
        setAlertMessage(false);
      }, 3000);
    }
  }, [alertMessage]);

  return (
    <div>
    <div className="card">
      <div className="card-header">
        <h3 className="card-title">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="icon"
          >
            <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
            <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
          </svg>
          Notification Preferences
        </h3>
      </div>

      <div className="card-body">
        <div className="section">
          <div className="section-header">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label className="label">Email Notifications</label>
              <p className="description">Receive medication alerts via email</p>
            </div>
            <ToggleSwitch
              checked={emailNotifications}
              onChange={() => setEmailNotifications(!emailNotifications)}
              id="email-notifications"
            />
          </div>
          <div className={emailNotifications ? "" : "hidden"}>
            <div style={{ margin: "2rem auto, width: 100%", textAlign:"left" }}>
             <label htmlFor="patient-name-input" className="label">Patient Name</label>
              <input
                type="text"
                placeholder="Patient Name"
                value={name}
                // disabled
                id="patient-name-input"
                onChange={(e) => setName(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px",marginTop:"0.2rem" }}
              />
              <label htmlFor="email-input" className="label">Email Address</label>
              <input
                type="email"
                placeholder="Enter your Patient Email Address"
                value={email}
                id="email-input"
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: "100%", marginBottom: "1rem", padding: "0.5rem", border: "1px solid #ccc", borderRadius: "4px",marginTop:"0.2rem" }}
              />
             
            
            </div>
          </div>
        </div>

        <hr />

        <div className="section">
          <div className="section-header">
            <div style={{ display: "flex", flexDirection: "column" }}>
              <label className="label">Missed Medication Alerts</label>
              <p className="description">Get notified when medication is not taken on time</p>
            </div>
            <ToggleSwitch
              checked={missedAlerts}
              onChange={() => setMissedAlerts(!missedAlerts)}
              id="missed-alerts"
            />
          </div>
          <div className={missedAlerts ? "" : "hidden"}>
            <div className="form-group">
              <label className="label">Alert me if medication isn't taken within</label>
              <select
                className="input"
                value={alertDelay}
                onChange={(e) => setAlertDelay(e.target.value)}
              >
                <option value="1">1 Minute</option>
                <option value="2">2 Minutes</option>
                <option value="5">5 Minutes</option>
                <option value="10">10 Minutes</option>
                <option value="15">15 Minutes</option>
                <option value="20">20 Minutes</option>
                <option value="25">25 Minutes</option>
                <option value="30">30 Minutes</option>
                
              </select>
            </div>

            <div className="form-group">
              <label className="label">Daily reminder time</label>
              <input
                type="time"
                value={reminderTime}
                onChange={(e) => setReminderTime(e.target.value)}
                className="input"
              />
              <p className="note">Time to check if today's medication was taken</p>
            </div>
          </div>
        </div>
        </div>
     
    </div>
    <div className="email-preview-card">
  <div className="email-preview-header">
    <h3 className="email-preview-title">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="email-icon"
        viewBox="0 0 24 24"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      Email Preview
    </h3>
  </div>
  <div className="email-preview-body">
    <div className="email-preview-box">
      <div className="email-preview-content">
        <div className="email-preview-subject">
          Subject: Medication Alert - {name}
        </div>
      <textarea className="email-preview-message-textarea" value={customMessage}
  onChange={(e) => setCustomMessage(e.target.value)}
  placeholder="Enter custom message..."></textarea>
      </div>
    </div>
    {error && <p className="error">Please fill all the fields</p>}
  </div>
  
</div>
<div className="button-container">
  <button className={alertMessage ? "alert-message" : "notification-button"} onClick={handleSendAlert}>{alertMessage ? `${status}` : "Save Notification Settings"}</button>
 
</div>
    </div>
  );
};

export default Notifications;

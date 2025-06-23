import React, { useState } from "react";
import Patient from "../../Patient/Patient";
import "./PatientMainContainer.css";
import MedicationCalendar from "../../MyCalender/calendar";
import { useMedication } from "../../../contexts/MedicationContext";

const PatientMainContainer = () => {
  const { selectedDate, setCheckedDateBoolean } = useMedication();
  const [checkedDates, setCheckedDates] = useState([]);
  const [photo, setPhoto] = useState(null);
  console.log(checkedDates);
  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      console.log('File selected:', file.name);
      setPhoto(file); 
      // setMedicationData(prev => ({
      //   ...prev,
      //   [selectedDate.toISOString().split('T')[0]]: {
      //     photo: file,
      //     status: 'taken'
      //   }
      // }));
    }
  };

 

  // const sendDateRequest = (date) => {
  //   const day = date.toLocaleDateString("en-US", { weekday: "long" });     
  //   const month = date.toLocaleDateString("en-US", { month: "short" });    
  //   const dateNum = date.getDate();                                        
  
  //   const fixedTime = new Date(date); 
  //   fixedTime.setHours(8, 0, 0, 0);   
  
  //   const time = fixedTime.toLocaleTimeString("en-US", {
  //     hour: "numeric",
  //     minute: "2-digit",
  //     hour12: true
  //   }); 
  
  //   const fullDate = date.toLocaleDateString("en-CA"); 
  
  //   const payload = {
  //     day,       
  //     month,     
  //     date: dateNum,  
  //     time,      
  //     fullDate,   
  //     status: "Completed",
  //     photo:photo
  //   };
  
  //   console.log("Sending payload:", payload);
  
  //   fetch("http://localhost:3000/dates", {
  //     method: "POST",
  //     headers: { "Content-Type": "application/json" },
  //     body: JSON.stringify(payload),
  //   })
  //     .then((res) => res.json())
  //     .then((data) => setCheckedDates(data.map(item => item.date)))
  //     .catch((err) => console.error("Error updating date:", err));
  
  //   setCheckedDateBoolean(true);
  // };
 

  const sendDateRequest = (date) => {
    const day = date.toLocaleDateString("en-US", { weekday: "long" });
    const month = date.toLocaleDateString("en-US", { month: "short" });
    const dateNum = date.getDate();
  
    const fixedTime = new Date(date);
    fixedTime.setHours(8, 0, 0, 0);
  
    const time = fixedTime.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true
    });
  
    const fullDate = date.toLocaleDateString("en-CA");
  
    const formData = new FormData();
    formData.append("day", day);
    formData.append("month", month);
    formData.append("date", dateNum);
    formData.append("time", time);
    formData.append("fullDate", fullDate);
    formData.append("status", "Completed");
  
    if (photo) {
      formData.append("photo", photo);
    }
  
    console.log("Sending FormData payload...");
  
    fetch("https://medication-ugnu.onrender.com/dates", {
      method: "POST",
      body: formData, // Don't set Content-Type manually
    })
      .then((res) => res.json())
      .then((data) => setCheckedDates(data.map(item => item.date)))
      .catch((err) => console.error("Error updating date:", err));
  
    setCheckedDateBoolean(true);
  };
  

  

  console.log(selectedDate);

  return (
    <div className="patient-main-container">
      <Patient />
      <div className="row-container">
        <div className="tracker-card">
          <div className="tracker-header">
            <h3 className="tracker-title">
              <svg className="icon calendar-icon" viewBox="0 0 24 24" fill="none">
                <path d="M8 2v4" stroke="currentColor" strokeWidth="2" />
                <path d="M16 2v4" stroke="currentColor" strokeWidth="2" />
                <rect x="3" y="4" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                <path d="M3 10h18" stroke="currentColor" strokeWidth="2" />
              </svg>
              Today's Medication
            </h3>
          </div>
          <div className="tracker-body">
            <div className="medication-card">
              <div className="medication-row">
                <div className="medication-info">
                  <div className="pill-icon">
                    <span>1</span>
                  </div>
                  <div>
                    <h4 className="medication-title">Daily Medication Set</h4>
                    <p className="medication-subtitle">Complete set of daily tablets</p>
                  </div>
                </div>
                <div className="time-badge">
                  <svg className="icon clock-icon" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2" />
                    <polyline points="12 6 12 12 16 14" stroke="currentColor" strokeWidth="2" fill="none" />
                  </svg>
                  8:00 AM
                </div>
              </div>
            </div>

            <div className="upload-card">
              <div className="upload-content">
                <svg className="icon image-icon" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="18" height="18" rx="2" stroke="currentColor" strokeWidth="2" />
                  <circle cx="9" cy="9" r="2" stroke="currentColor" strokeWidth="2" />
                  <path d="M21 15l-3.086-3.086a2 2 0 0 0-2.828 0L6 21" stroke="currentColor" strokeWidth="2" />
                </svg>
                <h3>Add Proof Photo (Optional)</h3>
                <p>Take a photo of your medication or pill organizer as confirmation</p>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden-input"
                  id="photoInput"
                  onChange={(e) => handlePhotoUpload(e)}
                />
                <button
                  className="photo-button"
                  onClick={() => document.getElementById('photoInput').click()}
                >
                  <svg className="icon camera-icon" viewBox="0 0 24 24" fill="none">
                    <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z" stroke="currentColor" strokeWidth="2" />
                    <circle cx="12" cy="13" r="3" stroke="currentColor" strokeWidth="2" />
                  </svg>
                  Take Photo
                </button>
              </div>
            </div>

            <button 
              className="submit-button"
              onClick={() => {
                sendDateRequest(selectedDate);
                // setMedicationData(prev => ({
                //   ...prev,
                //   [selectedDate.toISOString().split('T')[0]]: {
                //     status: 'taken'
                //   }
                // }));
              }}
            >
              <svg className="check-icon" viewBox="0 0 24 24" fill="none" height="36" width="36">
                <path d="M20 6 9 17l-5-5" stroke="currentColor" strokeWidth="2" />
              </svg>
              Mark as Taken
            </button>
          </div>
        </div>
        <div className="medication-calendar-container">
        <h2 style={{textAlign:"left" , width:"100%"}}>Medication Calendar</h2>
          <MedicationCalendar/>
          <div className="calendar-list" style={{textAlign:"left", width:"100%"}}>  
                    <h1 className="calendar-list-item">{`✅ Medication taken`}</h1> 
                    <h1 className="calendar-list-item">{`❌ Medication missed`}</h1>  
                    <h1 className="calendar-list-item" style={{display: "flex",alignItems: "center",gap: "10px"}}> <p className="dot"></p>{`Medication remaining`}</h1>  
                </div> 
        </div>

      </div>
    </div>
  );
};

export default PatientMainContainer;




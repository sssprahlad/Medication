
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { useMedication, } from "../../contexts/MedicationContext";

const MedicationCalendar = () => {
  const [checkedDates, setCheckedDates] = useState(["2025-06-10"]);
  const { checkedDateBoolean,handleDateChange,setCheckedDateBoolean } = useMedication();

  const fetchCheckedDates = () => {
    fetch("https://medication-ugnu.onrender.com/dates")
      .then((res) => res.json())
      .then((data) => {
        console.log(data,"res data");
        const backendDates = data.map(item => item.fullDate);
        setCheckedDates(prev => [...new Set([...prev, ...backendDates])]);
      })
      .catch((err) => console.error("Error fetching checked dates:", err));
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchCheckedDates();
      setCheckedDateBoolean(false); 
    }, 1000);
  
    return () => clearTimeout(timer); 
  }, [checkedDateBoolean]);
  

  const tileContent = ({ date }) => {
    const now = new Date();
    const today = new Date();
    today.setHours(0, 0, 0, 0); 
  
    const dateToCheck = new Date(date);
    dateToCheck.setHours(0, 0, 0, 0); 
  
    const formatted = date.toLocaleDateString("en-CA");
  
    const isChecked = checkedDates.includes(formatted);
    const isToday = dateToCheck.getTime() === today.getTime();
    const isPast = dateToCheck < today;
  
    if (isChecked) return "✅";
  
    if (isPast) return "❌";
  
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
  
    const isEndOfToday = currentHour === 23 && currentMinute >= 59;
  
    if (isToday && isEndOfToday) return "❌";
  
    return null;
  };
  
  

  return (
    <div style={{ maxWidth: 500 }}>
      {/* <h2>Mark Days as Checked or Unchecked</h2> */}
      <Calendar
        onClickDay={handleDateChange}
        tileContent={tileContent}
        tileClassName={({ date }) => {
          const formatted = date.toLocaleDateString("en-CA");
          return checkedDates.includes(formatted) ? "checked-date" : "";
        }}
      />
    </div>
  );
};

export default MedicationCalendar;

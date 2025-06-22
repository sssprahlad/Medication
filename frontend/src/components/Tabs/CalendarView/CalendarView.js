import React, { useEffect, useState } from "react";
import "./CalendarView.css";
import MedicationCalendar from "../../MyCalender/calendar";
import { useDispatch ,useSelector} from "react-redux";
//import { setAdherenceDataBoolean } from "../../redux/reducer/user";
import { useMedication } from "../../../contexts/MedicationContext";

const CalendarView = () => {

  const [status, setStatus] = useState(false);
const dispatch = useDispatch();
const {setAdherenceDataBoolean} = useMedication();
//const adherenceDataBoolean = useSelector((state) => state.user.adherenceDataBoolean);
  const user_name = localStorage.getItem("user_name");
  const today = new Date();
const formattedDate = today.toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",     
});

console.log(status);


  const AdherenceForm = () => {
    const [formData, setFormData] = useState({
      adherence_rate: "",
      current_streak: "",
      missed_this_month: "",
      taken_this_week: "",
    });
  
    const handleChange = (e) => {
      setFormData({
        ...formData,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus(true);
      //dispatch(setAdherenceDataBoolean(true));
      setAdherenceDataBoolean(true);
      console.log("Submitting:", formData);
      const responce = await fetch("https://medication-ugnu.onrender.com/adherence", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await responce.json();
      console.log(data);
      //dispatch(setAdherenceDataBoolean(true));
      setFormData({
        adherence_rate: "",
        current_streak: "",
        missed_this_month: "",
        taken_this_week: "",
      });
    
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        setStatus(false);
      }, 1000);
      return () => clearTimeout(timer);
    }, [status]);

    
  
    return (
      <form className="custom-form" onSubmit={handleSubmit}>
        <h2 className="custom-form-title">Adherence Input</h2>
  
        {Object.entries(formData).map(([field, value]) => (
          <div key={field} className="custom-input-group">
            <label htmlFor={field} className="custom-label">
              {field.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}
            </label>
            <input
              type="number"
              name={field}
              id={field}
              className="custom-input"
              value={value}
              onChange={handleChange}
              required
            />
          </div>
        ))}
  
        <button className="custom-submit-button" type="submit">
          Submit
        </button>
        {status ? <p style={{color:"green",fontSize:"1rem",margin:"1rem 0"}}>Adherence status submitted successfully!</p> : null}
      </form>
    );
  };

  const MedicationForm = () => {
    const [formData, setFormData] = useState({
      day_streak: "",
      today_status: "",
      monthly_rate: "",
    });
  
    const handleChange = (e) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      setStatus(true);
      setAdherenceDataBoolean(true);
      //dispatch(setAdherenceDataBoolean(true));
      console.log("Submitted data:", formData);
      const responce = await fetch("https://medication-ugnu.onrender.com/medication", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await responce.json();
      console.log(data);
     
      setFormData({
        day_streak: "",
        today_status: "",
        monthly_rate: "",
      });
      // setStatus(true);
    };
  
    return (
      <form className="med-form" onSubmit={handleSubmit}>
        <h2 className="med-title">Medication Stats</h2>
  
        <div className="med-input-group">
          <label htmlFor="day_streak" className="med-label">Day Streak</label>
          <input
            type="number"
            id="day_streak"
            name="day_streak"
            value={formData.day_streak}
            onChange={handleChange}
            className="med-input"
            required
          />
        </div>
  
        <div className="med-input-group">
          <label htmlFor="today_status" className="med-label">Today's Status</label>
          <input
            type="number"
            id="today_status"
            name="today_status"
            value={formData.today_status}
            onChange={handleChange}
            className="med-input"
            required
          />
        </div>
  
        <div className="med-input-group">
          <label htmlFor="monthly_rate" className="med-label">Monthly Rate (%)</label>
          <input
            type="number"
            id="monthly_rate"
            name="monthly_rate"
            value={formData.monthly_rate}
            onChange={handleChange}
            className="med-input"
            required
          />
        </div>
  
        <button type="submit" className="med-submit-btn">Submit</button>

        {status ? <p style={{color:"green",fontSize:"1rem",margin:"1rem 0"}}>Medication status submitted successfully!</p> : null}
      </form>
    );
  };
  
  

  const tabList = [
    { label: "Medication", content: MedicationForm() },
    { label: "Adherence", content: AdherenceForm() },
  ];

  const [activeTab, setActiveTab] = useState(0);

    return (
        <div className="calendar-view-container">
            <div className="calendar-left">
                <h1 className="calendar-title">Medication Calendar Overview</h1>
                <div className="calendar-row-container"> 
                <MedicationCalendar />
                <div className="calendar-list">  
                    <h1 className="calendar-list-item">{`✅ Medication taken`}</h1>  
                    <h1 className="calendar-list-item">{`❌ Medication missed`}</h1>  
                    <h1 className="calendar-list-item" style={{display: "flex",alignItems: "center",gap: "10px"}}> <p className="dot"></p>{`Medication remaining`}</h1>  
                </div>    
                </div>
            </div>
           
           <div className="calendar-right">
           <div>
      <h4 className="details-heading">Details for {formattedDate}</h4>
      <div className="details-section">
        <div className="details-card">
          <div className="details-header">
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
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span className="details-today">Today</span>
          </div>
          <p className="details-message">
            {`Monitor ${user_name} 's medication status for today.`}
          </p>
        </div>
        <div style={{display:"flex",gap:"1rem",backgroundColor:"#f1f6fb"}}>
          {tabList.map((tab, idx) => (
            <button 
              key={tab.label}
              onClick={() => setActiveTab(idx)}
              className={activeTab === idx ? "tab-button active" : "tab-button"}
            >
              {tab.label}
            </button>
          ))}
        </div>
        <div>
          {tabList[activeTab].content}
        </div>
      </div>
    </div>
           </div>
        </div>
    );
};

export default CalendarView;

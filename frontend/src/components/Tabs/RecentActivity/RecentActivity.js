import React from "react";
import "./RecentActivity.css";
import CompleteIcon from "../../Icons/Complete";
import PendingIcon from "../../Icons/Pending";
import { useEffect, useState } from "react";

const RecentActivity = () => {
  const [data, setData] = useState([]);
  const dummData = [
    {
      day: "Monday",
      month: "June",
      date: "10",
      time: "8:30 AM",
      // photo: true,
       status: "Completed",
    },
    {
      day: "Tuesday",
      month: "June",
      date: "11",
      time: "Medication missed",
      // photo: false,
       status: "Missed",
    },
  ];

  const updatedData = [...data, ...dummData];
  console.log(updatedData);
  

  const fetchCheckedDates = () => {
    fetch("https://medication-ugnu.onrender.com/dates")
      .then((res) => res.json())
      .then((data) => {
        console.log(data,"res data");
        setData(data.map(item => item));
      })
      .catch((err) => console.error("Error fetching checked dates:", err));
  };
  useEffect(() => {
      fetchCheckedDates();
  }, []);



  return (
    <div className="recent-activity-container">
      <h1 className="recent-activity-title">Recent Medication Activity</h1>
      <div className="recent-activity-list-container">
        {updatedData.map((item, index) => (
          <div key={index}>
            <div class="history-card">
              <div class="history-left">
                <div
                  class={
                    item.status === "Completed"
                      ? "icon-circle"
                      : "icon-circle bg-pending"
                  }
                >
                  {item.status === "Completed" ? (
                    <CompleteIcon />
                  ) : (
                    <PendingIcon />
                  )}
                </div>
                <div>
                  <p class="date-text">{`${item.day} ${item.month} ${item.date}`}</p>
                  <p class="time-text">{`${
                    item.status === "Completed" ? "Taken At :- " : ""}${item.time}`}</p>
                </div>
              </div>
              <div class="history-right">
                <div class={item.photo ? "badge" : "completed"}>
                  {item.photo ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      class="badge-icon"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    >
                      <path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"></path>
                      <circle cx="12" cy="13" r="3"></circle>
                    </svg>
                  ) : (
                    ""
                  )}
                  {item.photo ? "Photo" : ""}
                </div>
                <div
                  class={
                    item.status === "Completed"
                      ? "badge completed"
                      : "badge pending"
                  }
                >
                  {item.status}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentActivity;

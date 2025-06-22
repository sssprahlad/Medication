import React, { useState } from "react";
import "./Tab.css";
import Overview from "./Overview/Overview";
import RecentActivity from "./RecentActivity/RecentActivity";
import CalendarView from "./CalendarView/CalendarView";
import Notifications from "./Notifications/Notifications";

const tabList = [
  { label: "Overview", content: <Overview /> },
  { label: "Recent Activity", content: <RecentActivity /> },
  { label: "Calendar View", content: <CalendarView /> },
  { label: "Notifications", content: <Notifications /> },
];

const Tabs = () => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div>
      <div className="tabs-container">
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
     
      <div >
        {tabList[activeTab].content}
      </div>
    </div>
  );
};

export default Tabs;

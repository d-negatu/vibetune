import React from "react";
import Sidebar from "./sideBar.jsx";
import Content from "./content.jsx";
import PlayerControls from "./playerControls.jsx";
import "./dashboard.css";

const Dashboard = () => {
  return (
    <div className="dashboard">
      <Sidebar />
      <Content />
      <PlayerControls />
    </div>
  );
};

export default Dashboard;

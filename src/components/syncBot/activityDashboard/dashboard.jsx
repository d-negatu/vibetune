// ActivityDashboard.jsx

import React from 'react';
import './dashboard.css';

function ActivityDashboard() {
  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>Chat Session Activity Dashboard</h1>
        <div className="date-picker">[Date Range Picker]</div>
      </header>
      <div className="dashboard-metrics">
        <div className="metric-card">Messages Sent</div>
        <div className="metric-card">User Engagement</div>
      </div>
      <div className="dashboard-charts">
        <div className="chart">Sessions Over Time</div>
        <div className="chart">Messages Over Time</div>
      </div>
      <div className="dashboard-tables">
        <div className="table">Recent Sessions</div>
        <div className="table">Top Users</div>
      </div>
    </div>
  );
}

export default ActivityDashboard;
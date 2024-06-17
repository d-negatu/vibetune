// src/components/ActivityDashboard.jsx
import React, { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { db } from '../firebase';  // Ensure the correct path to firebase.js
import { collection, query, onSnapshot } from "firebase/firestore";
import './ActivityDashboard.css';

const ActivityDashboard = () => {
  const [activityData, setActivityData] = useState([]);

  useEffect(() => {
    const q = query(collection(db, 'sessions'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const sessions = [];
      querySnapshot.forEach((doc) => {
        sessions.push({
          ...doc.data(),
          timestamp: new Date(doc.data().createdAt.seconds * 1000).toLocaleTimeString()
        });
      });
      setActivityData(sessions);
    });

    return () => unsubscribe();
  }, []);

  return (
    <div className="dashboard">
      <h2>Real-Time Activity Dashboard</h2>
      <LineChart width={600} height={300} data={activityData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="userId" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </div>
  );
};

export default ActivityDashboard;

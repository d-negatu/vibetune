import React from 'react';
import { BarChart } from '@mui/x-charts/BarChart';

// Define chart settings
const chartSetting = {
  yAxis: [
    {
      label: "Number of messages",
      ticketMinStep: 1, // Ensure this is a valid numeric value
    },
  ],
  width: 500,
  height: 400,
  borderRadius: 10,
  barLevel: "value",
  grid: { horizontal: true },
  title: "Chat Activity",
  desc: "Bar chart between User and Chat Bot",
};

// Define the BarChartComponent
export default function BarChartComponent({ msgData }) {
  return (
    <div className="band">
      <BarChart
        xAxis={[
          {
            scaleType: "band",
            data: ["Bots Chats", "User Chats"],
            label: "Sender",
          },
        ]}
        series={[
          {
            data: [msgData[0], msgData[1]], // msgData should have at least 2 values
          },
        ]}
        {...chartSetting} // Spread chart settings
      />
    </div>
  );
}

import React, { useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import "./ActivityChart.css";

const ActivityChart = ({ activityData }) => {
  useEffect(() => {
    console.log("📊 Datos recibidos en ActivityChart:", activityData);
  }, [activityData]);

  if (!activityData || activityData.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos de actividad.</p>
    );
  }

  return (
    <div className="activity-chart-container">
      <h2 className="chart-title">📊 Actividad del Chat por Día</h2>
      <ResponsiveContainer width="95%" height={500}>
        <BarChart
          data={activityData}
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis dataKey="day" tick={{ fill: "#333", fontSize: 16 }} />
          <YAxis tick={{ fill: "#333", fontSize: 16 }} />
          <Tooltip
            cursor={{ fill: "rgba(50, 205, 50, 0.2)" }}
            formatter={(value) => `${value} mensajes`}
          />
          <Legend />
          <Bar
            dataKey="count"
            name="Mensajes"
            fill="#4CAF50"
            barSize={80}
            radius={[10, 10, 0, 0]}
            animationBegin={300}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ActivityChart;

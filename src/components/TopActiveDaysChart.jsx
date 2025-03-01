import React from "react";
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
import "./TopActiveDaysChart.css";

const TopActiveDaysChart = ({ data }) => {
  console.log("📊 Datos recibidos en TopActiveDaysChart:", data);

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos disponibles.</p>
    );
  }

  return (
    <div className="top-active-days-chart-container">
      <h2 className="chart-title">📊 Días Más Activos del Chat</h2>
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis dataKey="day" tick={{ fill: "#333", fontSize: 14 }} />
          <YAxis tick={{ fill: "#333", fontSize: 14 }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "8px",
              border: "1px solid #ddd",
              padding: "10px",
            }}
          />
          <Legend />
          <Bar
            dataKey="count"
            fill="#4CAF50"
            barSize={60} // Barras más gruesas
            radius={[10, 10, 0, 0]} // Bordes redondeados arriba
            animationBegin={200}
            animationDuration={1000}
            onMouseEnter={(data, index, e) => console.log("📌 Hover en:", data)}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TopActiveDaysChart;

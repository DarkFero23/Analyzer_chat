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
import "./MessagesByYearChart.css";

const MessagesByYearChart = ({ data }) => {
  console.log("📊 Datos recibidos en MessagesByYearChart:", data);

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">
        No hay datos de mensajes por año.
      </p>
    );
  }

  return (
    <div className="messages-by-year-chart-container">
      <h2 className="chart-title">📊 Mensajes por Año</h2>
      <ResponsiveContainer width="95%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis dataKey="year" tick={{ fill: "#333", fontSize: 16 }} />
          <YAxis tick={{ fill: "#333", fontSize: 16 }} />
          <Tooltip cursor={{ fill: "rgba(50, 205, 50, 0.2)" }} />
          <Legend />
          <Bar
            dataKey="count"
            fill="#4CAF50"
            barSize={80} // Barras gruesas
            radius={[10, 10, 0, 0]} // Bordes redondeados arriba
            animationBegin={300}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MessagesByYearChart;

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./MessagesByMonthChart.css";

const MessagesByMonthChart = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos de actividad.</p>
    );
  }

  return (
    <div className="messages-by-month-chart-container">
      <h2 className="chart-title">📊 Mensajes por Mes</h2>
      <ResponsiveContainer width="95%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="mes"
            tick={{ fill: "#333", fontSize: 14 }}
            interval={0} // 👈 FORZAR QUE SE MUESTREN TODOS
            padding={{ left: 10, right: 10 }} // 👈 ASEGURAR ESPACIADO CORRECTO
          />
          <YAxis tick={{ fill: "#333", fontSize: 14 }} />
          <Tooltip cursor={{ fill: "rgba(50, 205, 50, 0.2)" }} />
          <Bar
            dataKey="mensajes"
            fill="#4CAF50"
            barSize={50}
            radius={[10, 10, 0, 0]}
            animationBegin={300}
            animationDuration={1200}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MessagesByMonthChart;

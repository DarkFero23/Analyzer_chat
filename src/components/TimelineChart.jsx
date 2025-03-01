import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import "./TimelineChart.css";

const TimelineChart = ({ timelineData }) => {
  if (!timelineData || timelineData.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos disponibles.</p>
    );
  }

  console.log("📊 Datos recibidos en TimelineChart:", timelineData);

  return (
    <div className="timeline-chart-container">
      <h2 className="chart-title">📈 Línea Temporal de Mensajes</h2>
      <ResponsiveContainer width="95%" height={500}>
        <LineChart
          data={timelineData}
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="hora"
            tick={{ fill: "#333", fontSize: 12 }}
            angle={-25} // 🔥 Rotamos las etiquetas del eje X
            textAnchor="end"
          />
          <YAxis tick={{ fill: "#333", fontSize: 12 }} />
          <Tooltip formatter={(value) => `${value} mensajes`} />
          <Line
            type="monotone"
            dataKey="mensajes" // 🔥 Cambiado de "mensaje" a "mensajes"
            stroke="#32CD32"
            strokeWidth={3}
            dot={{ fill: "#32CD32", r: 6 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;

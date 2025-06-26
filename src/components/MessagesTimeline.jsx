//boton 📈 Gráfico Lineal de Mensajes por Día
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
import "./MessagesTimeline.css";

const MessagesTimeline = ({ timelineDataDay, topDays, bottomDays }) => {
  if (!timelineDataDay || timelineDataDay.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos disponibles.</p>
    );
  }

  // 🔹 Formatear fechas
  const formattedData = timelineDataDay.map((item) => ({
    ...item,
    fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
      day: "2-digit",
      month: "2-digit",
      year: "2-digit",
    }),
  }));

  const formattedTopDays = topDays
    ? topDays.map((item) => ({
        ...item,
        fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
      }))
    : [];

  const formattedBottomDays = bottomDays
    ? bottomDays.map((item) => ({
        ...item,
        fecha: new Date(item.fecha).toLocaleDateString("es-ES", {
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
      }))
    : [];

  return (
    <div className="timeline-container">
      <div className="chart-content">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={formattedData}
            margin={{ top: 20, right: 30, left: 20, bottom: 50 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis
              dataKey="fecha"
              type="category"
              tick={{ fill: "#333", fontSize: 14 }}
              angle={-30}
              textAnchor="end"
            />
            <YAxis tick={{ fill: "#333", fontSize: 14 }} />
            <Tooltip
              labelFormatter={(label) => `Fecha: ${label}`}
              formatter={(value) => `${value} mensajes`}
            />
            <Line
              type="monotone"
              dataKey="mensajes"
              stroke="#32CD32"
              strokeWidth={window.innerWidth < 480 ? 1.5 : 0.8}
              dot={{ fill: "#32CD32", r: window.innerWidth < 480 ? 2 : 6 }}
              activeDot={{ r: window.innerWidth < 480 ? 4 : 8 }}
              animationDuration={1200}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* 📅 Leyenda ahora a la derecha */}
      <div className="legend-box">
        <h3>📋 Resumen de Días</h3>
        <div className="legend-section">
          <strong className="legend-title">🔥 Días con más mensajes:</strong>
          <ul>
            {formattedTopDays.map((day, index) => (
              <li key={index} className="top-day">
                {day.fecha} - {day.mensajes} mensajes
              </li>
            ))}
          </ul>
        </div>
        <div className="legend-section">
          <strong className="legend-title">❄️ Días con menos mensajes:</strong>
          <ul>
            {formattedBottomDays.map((day, index) => (
              <li key={index} className="bottom-day">
                {day.fecha} - {day.mensajes} mensajes
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default MessagesTimeline;

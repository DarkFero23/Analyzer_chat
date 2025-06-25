// BOTON:📊 Gráfico de Mensajes por Mes
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
    return <p className="no-data">No hay datos de actividad.</p>;
  }

  return (
    <div className="messages-by-month-chart-container">
      <h2 className="chart-title">📊 Mensajes por Mes</h2>
      {/* Wrapper que controla la altura según el tamaño de pantalla */}
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 80 }}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis
              dataKey="mes"
              tick={{ fill: "#333", fontSize: 12 }}
              interval={0}
              height={80}
              tickMargin={10} /* + espacio entre línea y etiqueta */
              angle={-45}
              textAnchor="end"
              padding={{ left: 10, right: 10 }}
            />
            <YAxis tick={{ fill: "#333", fontSize: 12 }} />
            <Tooltip cursor={{ fill: "rgba(50, 205, 50, 0.2)" }} />
            <Bar
              dataKey="mensajes"
              fill="#4CAF50"
              barSize={24}
              radius={[6, 6, 0, 0]}
              animationBegin={300}
              animationDuration={1200}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MessagesByMonthChart;

//boton :"📈 Gráfico Lineal de Mensajes por Año"

import React, { useEffect, useState } from "react";
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

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const TimelineChart = ({ timelineData }) => {
  const width = useWindowWidth();

  if (!timelineData || timelineData.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos disponibles.</p>
    );
  }

  console.log("📊 Datos recibidos en TimelineChart:", timelineData);

  return (
    <div className="timeline-chart-container">
      <h2 className="chart-title">📈 Línea Temporal de Mensajes</h2>
      <ResponsiveContainer width="100%" height={500}>
        <LineChart
          data={timelineData}
          margin={{
            top: 20,
            right: 50,
            left: 50,
            bottom: width <= 480 ? 80 : 50,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="hora"
            tick={{
              fill: "#333",
              fontSize: width <= 480 ? 10 : 12,
            }}
            angle={width <= 480 ? -45 : 0}
            textAnchor={width <= 480 ? "end" : "middle"}
            height={width <= 480 ? 70 : 40}
            tickMargin={8}
          />
          <YAxis
            tick={{ fill: "#333", fontSize: width <= 480 ? 10 : 12 }}
            domain={[0, "auto"]}
            allowDecimals={false}
          />
          <Tooltip formatter={(value) => `${value} mensajes`} />
          <Line
            type="monotone"
            dataKey="mensajes"
            name="Mensajes"
            stroke="#32CD32"
            strokeWidth={3}
            dot={{ fill: "#32CD32", r: 5 }}
            activeDot={{ r: 7 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TimelineChart;

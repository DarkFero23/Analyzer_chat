// Botón: 📊 Gráfico de Mensajes por Año
import React, { useState, useEffect } from "react";
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

// Hook para detectar el ancho de pantalla
const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const MessagesByYearChart = ({ data }) => {
  const width = useWindowWidth();

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
      <ResponsiveContainer width="100%" height={500}>
        <BarChart
          data={data}
          margin={{ top: 20, right: 50, left: 50, bottom: 60 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="year"
            tick={{
              fill: "#333",
              fontSize: width <= 480 ? 12 : 16,
            }}
            height={width <= 480 ? 100 : 40}
            tickMargin={width <= 480 ? 10 : 5}
          />
          <YAxis
            tick={{ fill: "#333", fontSize: width <= 480 ? 12 : 16 }}
            domain={[0, "auto"]}
            allowDecimals={false}
          />
          <Tooltip
            cursor={{ fill: "rgba(50, 205, 50, 0.2)" }}
            formatter={(value) => [`${value}`, "Mensajes"]}
          />
          <Legend
            formatter={() => "Mensajes"}
            wrapperStyle={{
              fontSize: width <= 480 ? "12px" : "14px",
              paddingBottom: "10px",
            }}
          />
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

export default MessagesByYearChart;

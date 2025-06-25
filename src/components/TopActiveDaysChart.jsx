// Btoon Grafico de dias mas activos del caht .jsx
import React, { useEffect, useState } from "react";
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

const useWindowWidth = () => {
  const [width, setWidth] = useState(window.innerWidth);
  useEffect(() => {
    const handleResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return width;
};

const TopActiveDaysChart = ({ data }) => {
  const width = useWindowWidth();

  if (!data || data.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos disponibles.</p>
    );
  }

  return (
    <div className="top-active-days-chart-container">
      <h2 className="chart-title">📊 Días Más Activos del Chat</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={data}
            margin={{
              top: 10,
              right: 20,
              left: width <= 480 ? 30 : 60,
              bottom: width <= 480 ? 30 : 40,
            }}
            barCategoryGap="20%"
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis
              dataKey="day"
              tick={{
                fill: "#333",
                fontSize: width <= 480 ? 10 : 12,
              }}
              height={width <= 480 ? 100 : 40}
              tickMargin={width <= 480 ? 10 : 5}
              angle={width <= 480 ? -90 : 0}
              textAnchor={width <= 480 ? "end" : "middle"}
            />
            <YAxis
              domain={[0, "auto"]}
              tick={{ fill: "#333", fontSize: width <= 480 ? 10 : 12 }}
              allowDecimals={false}
              width={width <= 480 ? 35 : 50}
              tickMargin={4}
            />
            <Tooltip
              formatter={(value, name) => [`${value}`, "Mensajes"]}
              contentStyle={{
                backgroundColor: "rgba(255, 255, 255, 0.9)",
                borderRadius: "8px",
                border: "1px solid #ddd",
                padding: "10px",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                fontSize: width <= 480 ? "11px" : "12px",
                paddingBottom: "10px",
              }}
              formatter={() => "Mensajes"}
            />
            <Bar
              dataKey="count"
              name="Mensajes"
              fill="#4CAF50"
              barSize={width <= 480 ? 35 : 60}
              radius={[8, 8, 0, 0]}
              animationBegin={300}
              animationDuration={1000}
              onMouseEnter={(data) => console.log("📌 Hover en:", data)}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default TopActiveDaysChart;

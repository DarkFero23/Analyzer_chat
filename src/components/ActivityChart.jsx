import React, { useEffect, useMemo, useState } from "react";
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

const ActivityChart = ({ activityData }) => {
  const width = useWindowWidth();

  useEffect(() => {
    console.log("📊 Datos recibidos en ActivityChart:", activityData);
  }, [activityData]);

  if (!activityData || activityData.length === 0) {
    return <p className="no-data">No hay datos de actividad.</p>;
  }

  const processedData = useMemo(() => {
    if (width <= 480) {
      const map = {
        Lunes: "Lun",
        Martes: "Mar",
        Miércoles: "Mié",
        Jueves: "Jue",
        Viernes: "Vie",
        Sábado: "Sáb",
        Domingo: "Dom",
      };
      return activityData.map((item) => ({
        ...item,
        day: map[item.day] || item.day,
      }));
    }
    return activityData;
  }, [activityData, width]);

  return (
    <div className="activity-chart-container">
      <h2 className="chart-title">📊 Actividad del Chat por Día</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={processedData}
            margin={{
              top: 20,
              right: 20,
              left: width <= 480 ? 35 : 60,
              bottom: width <= 480 ? 35 : 30,
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
              interval={0}
              angle={0}
              height={40}
              tickMargin={5}
            />
            <YAxis
              domain={[0, "auto"]}
              tick={{ fill: "#333", fontSize: width <= 480 ? 10 : 12 }}
              allowDecimals={false}
              width={width <= 480 ? 35 : 50}
              tickMargin={4}
            />
            <Tooltip
              cursor={{ fill: "rgba(50, 205, 50, 0.2)" }}
              formatter={(value) => `${value} mensajes`}
            />
            <Legend
              verticalAlign="top"
              height={36}
              wrapperStyle={{
                fontSize: width <= 480 ? "11px" : "12px",
                paddingBottom: "10px",
              }}
            />
            <Bar
              dataKey="count"
              name="Mensajes"
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

export default ActivityChart;

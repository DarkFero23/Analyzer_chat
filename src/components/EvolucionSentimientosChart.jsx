//BOTON Carga emocional por día
import React, { useEffect } from "react";
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
import "./EvolucionSentimientosChart.css";

const EvolucionSentimientosChart = ({ evolucionSentimientosData }) => {
  useEffect(() => {
    console.log(
      "📊 Datos recibidos en EvolucionSentimientosChart:",
      evolucionSentimientosData
    );
  }, [evolucionSentimientosData]);

  if (!evolucionSentimientosData || evolucionSentimientosData.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos de sentimiento.</p>
    );
  }

  return (
    <div className="evolucion-sentimientos-chart-container">
      <h2 className="chart-title">📊 Evolución del Sentimiento</h2>
      <ResponsiveContainer width="95%" height={500}>
        <BarChart
          data={evolucionSentimientosData}
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
          barCategoryGap={15} // 🔹 Espaciado entre barras para mayor claridad
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis
            dataKey="fecha"
            tick={{ fill: "#333", fontSize: 14 }}
            angle={-45} // 🔹 Rotar etiquetas de fechas para mejor lectura
            textAnchor="end"
          />
          <YAxis
            tick={{ fill: "#333", fontSize: 14 }}
            domain={[0, (dataMax) => dataMax + 10]} // 🔹 Asegura espacio en el eje Y
          />
          <Tooltip
            cursor={{ fill: "rgba(50, 205, 50, 0.1)" }}
            formatter={(value, name) => [`${value} mensajes`, name]}
          />
          <Legend
            verticalAlign="top"
            wrapperStyle={{ fontSize: "14px", fontWeight: "bold" }}
          />
          <Bar
            dataKey="positivo"
            name="Positivos 😊"
            fill="#4CAF50"
            barSize={40}
            radius={[5, 5, 0, 0]}
            animationBegin={300}
            animationDuration={1000}
          />
          <Bar
            dataKey="neutro"
            name="Neutros 😐"
            fill="#9E9E9E"
            barSize={40}
            radius={[5, 5, 0, 0]}
            animationBegin={300}
            animationDuration={1000}
          />
          <Bar
            dataKey="negativo"
            name="Negativos 😡"
            fill="#F44336"
            barSize={40}
            radius={[5, 5, 0, 0]}
            animationBegin={300}
            animationDuration={1000}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EvolucionSentimientosChart;

//boton:"📊 Sentimientos positivos y negativos por día"

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
  Cell,
} from "recharts";
import "./SentimentAvgGraph.css"; // Asegúrate de tener estilos

const SentimentAvgGraph = ({ sentimentData }) => {
  useEffect(() => {
    console.log("📊 Datos recibidos en SentimentAvgGraph:", sentimentData);
  }, [sentimentData]);

  if (!sentimentData || sentimentData.length === 0) {
    return (
      <p className="text-center text-gray-500">No hay datos de sentimiento.</p>
    );
  }

  return (
    <div className="sentiment-avg-graph-container">
      <h2 className="chart-title">📊 Sentimiento Promedio por Día</h2>

      {/* 🔥 Leyenda personalizada */}
      <div className="custom-legend">
        <div className="legend-item">
          <span className="legend-box good-vibes"></span>
          <span className="legend-text">Cerca de 1 → Buenas vibras 😊</span>
        </div>
        <div className="legend-item">
          <span className="legend-box neutral-vibes"></span>
          <span className="legend-text">Cerca de 0 → Neutral 😐</span>
        </div>
        <div className="legend-item">
          <span className="legend-box bad-vibes"></span>
          <span className="legend-text">Cerca de -1 → Malas vibras 😞</span>
        </div>
      </div>

      <ResponsiveContainer width="95%" height={500}>
        <BarChart
          data={sentimentData}
          margin={{ top: 20, right: 50, left: 50, bottom: 50 }}
        >
          <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
          <XAxis dataKey="fecha" tick={{ fill: "#333", fontSize: 16 }} />
          <YAxis tick={{ fill: "#333", fontSize: 16 }} />

          {/* Tooltip personalizado */}
          <Tooltip
            wrapperStyle={{ fontSize: "20px", padding: "15px" }} // Aumentamos tamaño del tooltip
            contentStyle={{
              backgroundColor: "white",
              borderRadius: "10px",
              padding: "12px",
              border: "1px solid #ccc",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            }}
            itemStyle={{ fontSize: "16px", color: "#333" }}
            cursor={{ fill: "rgba(50, 205, 50, 0.2)" }}
            formatter={(value) => `${value.toFixed(2)} `}
          />
          <Legend />
          <Bar
            dataKey="puntaje_sentimiento"
            name="Sentimiento Promedio"
            barSize={80}
            radius={[10, 10, 0, 0]}
            animationBegin={300}
            animationDuration={1200}
          >
            {sentimentData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={
                  entry.puntaje_sentimiento < 0
                    ? "#e93938" // Rojo para negativo
                    : "#4CAF50" // Verde para positivo
                }
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default SentimentAvgGraph;

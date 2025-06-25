//BOTON _:"📈 Gráfico de barras de sentimientos del chat"

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./SentimentStats.css";

const SentimentStats = ({ sentiment }) => {
  if (!sentiment) {
    return <p className="error-message">⚠️ No hay datos de sentimiento.</p>;
  }

  // Datos en un solo objeto con una barra por categoría
  const data = [
    {
      name: "Sentimientos",
      Negativo: parseFloat(sentiment.negativo),
      Neutro: parseFloat(sentiment.neutro),
      Positivo: parseFloat(sentiment.positivo),
    },
  ];

  // Formato para mostrar los valores con "%" en el tooltip y ejes
  const formatPercent = (value) => `${value.toFixed(2)}%`;

  return (
    <div className="sentiment-container">
      <h2>📊 Análisis de Sentimiento</h2>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: 10, bottom: 30 }}
            barGap={10}
            barCategoryGap="20%"
          >
            <XAxis dataKey="name" tick={{ fill: "#555", fontSize: 12 }} />
            <YAxis
              domain={[0, 100]}
              tickFormatter={formatPercent}
              tick={{ fill: "#555", fontSize: 12 }}
            />
            <Tooltip formatter={formatPercent} />
            <Legend
              wrapperStyle={{
                fontSize: "12px",
                bottom: 0,
                position: "absolute",
                width: "100%",
                textAlign: "center",
              }}
              layout="horizontal"
              verticalAlign="bottom"
            />
            <Bar
              dataKey="Negativo"
              fill="#ff6b6b"
              name="Negativo"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="Neutro"
              fill="#f8c291"
              name="Neutro"
              radius={[6, 6, 0, 0]}
            />
            <Bar
              dataKey="Positivo"
              fill="#6ab04c"
              name="Positivo"
              radius={[6, 6, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SentimentStats;

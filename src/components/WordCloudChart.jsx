// WordCloudChart.jsx
import React from "react";
import "./WordCloudChart.css";

const WordCloudChart = ({ palabras }) => {
  if (!Array.isArray(palabras) || palabras.length === 0) {
    return <p>No hay datos para mostrar la nube.</p>;
  }

  const valorMaximo = Math.max(...palabras.map((p) => p.value));

  return (
    <div className="wordcloud-wrapper">
      <h3 className="wordcloud-title">☁️ Nube de Palabras</h3>
      <div className="wordcloud-container">
        {palabras.map((palabra, i) => (
          <span
            key={i}
            className="wordcloud-word"
            style={{
              fontSize: calcularTamaño(palabra.value, valorMaximo),
            }}
            title={`Aparece ${palabra.value} veces`}
          >
            {palabra.text}
          </span>
        ))}
      </div>
    </div>
  );
};

const calcularTamaño = (valor, valorMax) => {
  const minSize = 14;
  const maxSize = 42;
  return `${(valor / valorMax) * (maxSize - minSize) + minSize}px`;
};

export default WordCloudChart;
import React from "react";
import "./SentimentStats.css"; // Importamos el CSS

const SentimentStats = ({ sentiment }) => {
  if (!sentiment) return <p>Error: No hay datos de sentimiento.</p>;

  return (
    <div className="sentiment-container">
      <h2>📊 Análisis de Sentimiento</h2>
      <div className="sentiment-item">
        <span className="sentiment-label negativo">Negativo:</span>
        <span className="sentiment-value">{sentiment.negativo}</span>
      </div>
      <div className="sentiment-item">
        <span className="sentiment-label neutro">Neutro:</span>
        <span className="sentiment-value">{sentiment.neutro}</span>
      </div>
      <div className="sentiment-item">
        <span className="sentiment-label positivo">Positivo:</span>
        <span className="sentiment-value">{sentiment.positivo}</span>
      </div>
    </div>
  );
};

export default SentimentStats;

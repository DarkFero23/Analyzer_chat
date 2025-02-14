import React from "react";
import "./TopWords.css"; // Importa el archivo CSS

const TopWords = ({ topPalabras }) => {
  if (!topPalabras || !topPalabras.top_palabras_por_usuario) {
    return <p className="error-message">❌ Error: No hay datos de palabras.</p>;
  }

  return (
    <div className="top-words-container">
      <h2 className="title">📌 Palabras Más Usadas por Usuario</h2>
      <div className="users-container">
        {Object.entries(topPalabras.top_palabras_por_usuario).map(([usuario, palabras]) => (
          <div key={usuario} className="user-section">
            <h3 className="user-title">👤 {usuario}</h3>
            <ul className="word-list">
              {palabras.map((item, idx) => (
                <li key={idx} className="word-item">
                  <span className="word">🔹 {item.palabra}</span> 
                  <span className="count">({item.cantidad})</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopWords;

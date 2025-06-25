//Boton: 📅 Palabras Tóxicas por Usuario

import React from "react";
import "./OffensiveWords.css"; // Importamos el CSS

const OffensiveWords = ({ data }) => {
  return (
    <div className="offensive-container">
      <h2>📌 Uso de Palabras Ofensivas</h2>
      {Object.keys(data).length === 0 ? (
        <p className="no-data">No hay datos disponibles.</p>
      ) : (
        <ul className="user-list">
          {Object.entries(data).map(([user, words]) => {
            // Convertimos las palabras en un array y las ordenamos de mayor a menor
            const sortedWords = Object.entries(words).sort(
              (a, b) => b[1] - a[1]
            );

            return (
              <li key={user} className="user-section">
                <h3>{user}</h3>
                {sortedWords.length > 0 ? (
                  <ul className="words-list">
                    {sortedWords.map(([word, count]) => (
                      <li key={word} className="word-item">
                        <span className="word">{word}</span>
                        <span className="count">{count}</span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="no-words">✅ No usó palabras ofensivas.</p>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default OffensiveWords;

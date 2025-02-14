import React from "react";
import "./OffensiveWords.css"; // Importamos el CSS

const OffensiveWords = ({ data }) => {
  return (
    <div className="offensive-container">
      <h2>📌 Uso de Palabras Ofensivas</h2>
      {Object.keys(data).length === 0 ? (
        <p>No hay datos disponibles.</p>
      ) : (
        <ul>
          {Object.entries(data).map(([user, words]) => (
            <li key={user} className="user-section">
              <h3>{user}</h3>
              {Object.keys(words).length > 0 ? (
                <ul className="words-list">
                  {Object.entries(words).map(([word, count]) => (
                    <li key={word}>
                      <span className="word">{word}</span>: <span className="count">{count}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="no-words">✅ No usó palabras ofensivas.</p>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default OffensiveWords;
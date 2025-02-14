import React from "react";
import "./EmotionalMessages.css"; // Importamos el CSS

const EmotionalMessages = ({ emotionalMessages }) => {
  if (!emotionalMessages) return <p>Error: No hay datos de mensajes emocionales.</p>;

  return (
    <div className="emotional-container">
      <h2>📌 Mensajes con Mayor Emoción</h2>

      <div className="emotional-section positivos">
        <h3>🌟 Más Positivos</h3>
        {emotionalMessages.mensajes_mas_positivos.length > 0 ? (
          <ul>
            {emotionalMessages.mensajes_mas_positivos.map((msg, index) => (
              <li key={index}>
                <strong>{msg.autor}</strong>: {msg.mensaje}
                <span className="fecha">({msg.fecha})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay mensajes positivos.</p>
        )}
      </div>

      <div className="emotional-section negativos">
        <h3>⚠️ Más Negativos</h3>
        {emotionalMessages.mensajes_mas_negativos.length > 0 ? (
          <ul>
            {emotionalMessages.mensajes_mas_negativos.map((msg, index) => (
              <li key={index}>
                <strong>{msg.autor}</strong>: {msg.mensaje}
                <span className="fecha">({msg.fecha})</span>
              </li>
            ))}
          </ul>
        ) : (
          <p>No hay mensajes negativos.</p>
        )}
      </div>
    </div>
  );
};

export default EmotionalMessages;

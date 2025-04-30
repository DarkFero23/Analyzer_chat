import React from "react";
import "./AutorReanudaChart.css";

const AutorReanudaChart = ({ data }) => {
  if (!data) return null;

  const { autor_que_mas_reanuda, veces_que_reanudo, autor_contraste, veces_que_reanudo_contraste, top_5_mensajes_post_descanso } = data;

  return (
    <div className="reanuda-container">
      <h3 className="reanuda-title">🔁 Autor que más reanuda conversación tras tiempos muertos</h3>

      <div className="reanuda-summary">
        <p>
          <strong>{autor_que_mas_reanuda}</strong> reanudó la conversación <strong>{veces_que_reanudo}</strong> veces.
        </p>
        {autor_contraste && (
          <p>
            Por contraste, <strong>{autor_contraste}</strong> lo hizo <strong>{veces_que_reanudo_contraste}</strong> veces.
          </p>
        )}
      </div>

      <div className="reanuda-section">
        <h4>📝 Mensajes más largos tras reanudar:</h4>
        <div className="reanuda-mensajes">
          {[autor_que_mas_reanuda, autor_contraste].map(
            (autor) =>
              autor &&
              top_5_mensajes_post_descanso[autor]?.length > 0 && (
                <div key={autor} className="reanuda-autor-card">
                  <h5>{autor}</h5>
                  <ul>
                    {top_5_mensajes_post_descanso[autor].map((msg, i) => (
                      <li key={i}>
                        <span className="fecha">{msg.datetime}</span>
                        <p>{msg.mensaje}</p>
                      </li>
                    ))}
                  </ul>
                </div>
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default AutorReanudaChart;

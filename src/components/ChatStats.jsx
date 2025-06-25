//BOTON: EL DE ESTADISTICAS
import React from "react";
import "./ChatStats.css"; // Importa el CSS

const ChatStats = ({ stats }) => {
  if (!stats || !stats.resumen_general || !stats.estadisticas_por_autor) {
    return <p>Cargando estadísticas...</p>;
  }

  const { resumen_general, estadisticas_por_autor } = stats;

  return (
    <div className="chat-stats-container">
      <h3 className="chat-stats-title">📊 Estadísticas Generales:</h3>
      <ul className="chat-stats-list">
        <li className="chat-stats-item">
          📌 <b>Total Mensajes:</b> {resumen_general.total_mensajes}
        </li>
        <li className="chat-stats-item">
          📸 <b>Stickers e Imágenes:</b> {resumen_general.mensajes_multimedia} (
          {resumen_general.porcentaje_multimedia})
        </li>
        <li className="chat-stats-item">
          ❌ <b>Mensajes Eliminados:</b> {resumen_general.mensajes_eliminados} (
          {resumen_general.porcentaje_eliminados})
        </li>
        <li className="chat-stats-item">
          🔗 <b>Total Links Compartidos:</b> {resumen_general.total_links}
        </li>
        <li className="chat-stats-item">
          ✍️ <b>Total Caracteres:</b> {resumen_general.total_caracteres}
        </li>
        <li className="chat-stats-item">
          📏 <b>Promedio de Caracteres por Mensaje:</b>{" "}
          {resumen_general.promedio_caracteres}
        </li>
      </ul>

      <h3 className="chat-stats-title">👥 Estadísticas por Autor:</h3>
      {estadisticas_por_autor.map((autor, index) => (
        <div key={index} className="chat-author-stats">
          <h4 className="chat-author-name">📝 {autor.autor}</h4>
          <ul className="chat-stats-list">
            <li className="chat-stats-item">
              📌 <b>Total Mensajes:</b> {autor.total_mensajes}
            </li>
            <li className="chat-stats-item">
              📸 <b>Multimedia:</b> {autor.mensajes_multimedia} (
              {autor.porcentaje_multimedia}%)
            </li>
            <li className="chat-stats-item">
              ❌ <b>Eliminados:</b> {autor.mensajes_eliminados} (
              {autor.porcentaje_eliminados}%)
            </li>
            <li className="chat-stats-item">
              🔗 <b>Links Compartidos:</b> {autor.total_links}
            </li>
            <li className="chat-stats-item">
              ✍️ <b>Total Caracteres:</b> {autor.total_caracteres}
            </li>
            <li className="chat-stats-item">
              📏 <b>Promedio de Caracteres:</b> {autor.promedio_caracteres}
            </li>
          </ul>
        </div>
      ))}
    </div>
  );
};

export default ChatStats;

import React from 'react';
import './ChatStats.css'; // Importa el CSS

const ChatStats = ({ stats }) => (
  <div className="chat-stats-container">
    <h3 className="chat-stats-title">📊 Estadísticas del Chat:</h3>
    <ul className="chat-stats-list">
      <li className="chat-stats-item">📌 <b>Total Mensajes:</b> {stats.total_mensajes}</li>
      <li className="chat-stats-item">📸 <b>Stickers y imagenes:</b>      {stats.mensajes_multimedia} ({stats.porcentaje_multimedia})</li>
      <li className="chat-stats-item">❌ <b>Mensajes Eliminados:</b> {stats.mensajes_eliminados} ({stats.porcentaje_eliminados})</li>
      <li className="chat-stats-item">🔗 <b>Total Links Compartidos:</b> {stats.total_links}</li>
      <li className="chat-stats-item">✍️ <b>Total Caracteres:</b> {stats.total_caracteres}</li>
      <li className="chat-stats-item">📏 <b>Promedio de Caracteres por Mensaje:</b> {stats.promedio_caracteres}</li>
    </ul>
  </div>
);

export default ChatStats;

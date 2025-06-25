//BOTON:🔠 Buscar palabra por autor

import React, { useState } from "react";
import "./WordCountByUser.css";

const WordCountByUser = ({ archivoChatId, fetchPalabra }) => {
  const [palabra, setPalabra] = useState("");
  const [resultado, setResultado] = useState(null);
  const [loading, setLoading] = useState(false);

  const buscarPalabra = async () => {
    if (!palabra.trim()) return;
    setLoading(true);
    const data = await fetchPalabra(palabra.trim());
    setResultado(data);
    setLoading(false);
  };

  return (
    <div className="word-count-container">
      <h3 className="word-title">🔠 Buscar palabra por autor</h3>

      <div className="input-busqueda">
        <input
          type="text"
          value={palabra}
          onChange={(e) => setPalabra(e.target.value)}
          placeholder="Escribe la palabra a buscar..."
        />
        <button onClick={buscarPalabra}>Buscar</button>
      </div>

      {loading && <p className="cargando">Cargando...</p>}

      {resultado && (
        <>
          <h4 className="word-subtitle">
            Resultados para: <span className="word-highlight">{palabra}</span>
          </h4>

          {Object.keys(resultado.conteo_por_autor || {}).length === 0 ? (
            <p className="sin-datos">❌ Ningún autor dijo la palabra.</p>
          ) : (
            <div className="cards-grid">
              {Object.entries(resultado.conteo_por_autor).map(
                ([autor, cantidad]) => (
                  <div key={autor} className="word-card">
                    <p className="autor-nombre">{autor}</p>
                    <p className="autor-cantidad">
                      {cantidad} {cantidad === 1 ? "vez" : "veces"}
                    </p>
                  </div>
                )
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default WordCountByUser;

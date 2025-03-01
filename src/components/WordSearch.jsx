import { useState } from "react";

const WordSearch = ({ apiUrl, userToken }) => {
  const [word, setWord] = useState("");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSearch = async () => {
    if (!word.trim()) {
      setError("Ingresa una palabra para buscar.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const response = await fetch(
        `${apiUrl}/buscar_palabra?user_token=${userToken}&palabra=${word}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en la búsqueda.");
      }

      setResult(data);
    } catch (err) {
      setError(err.message);
      setResult(null);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-container">
      <h2>Buscar palabra en el chat</h2>
      <input
        type="text"
        placeholder="Escribe una palabra..."
        value={word}
        onChange={(e) => setWord(e.target.value)}
      />
      <button onClick={handleSearch} disabled={loading}>
        {loading ? "Buscando..." : "Buscar"}
      </button>

      {error && <p className="error">{error}</p>}

      {result && (
        <div className="result-container">
          <h3>Resultados para "{result.palabra}"</h3>
          <p>
            <b>Total de veces:</b> {result.total_ocurrencias}
          </p>
          <h4>Por usuario:</h4>
          <ul>
            {Object.entries(result.detalle_por_usuario).map(([user, count]) => (
              <li key={user}>
                <b>{user}:</b> {count} veces
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default WordSearch;

import React, { useState } from "react";
import axios from "axios";
import ChatStats from "./components/ChatStats";
import TopWords from "./components/TopWords";
import EmotionalMessages from "./components/EmotionalMessages";
import SentimentStats from "./components/SentimentStats";
import Swal from 'sweetalert2';
import OffensiveWords from "./components/OffensiveWords";
import withReactContent from 'sweetalert2-react-content';
import EmojiChart from "./components/EmojiChart";

//LOCAL
//const API_URL = "http://localhost:5000"; 
//RENDER
const API_URL = "https://analyzer-chat-back.onrender.com"; 
//
const MySwal = withReactContent(Swal);

function App() {
  const [topEmojis, setTopEmojis] = useState(null);  // Estado inicial
  const [topEmojisPorUsuario, setTopEmojisPorUsuario] = useState(null); // Estado inicial
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [graficoEvolucionSentimientos, setGraficoEvolucionSentimientos] = useState(null);
  const [content, setContent] = useState(null);
  const [sentimentData, setSentimentData] = useState(null);
  const [topPalabras, setTopPalabras] = useState(null);
  const [fileUploaded, setFileUploaded] = useState(false); // Estado que in
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(null);
  const [fecha, setFecha] = useState("");
  const [nubeUrl, setNubeUrl] = useState(null);
  const [sentiment, setSentiment] = useState(null);
  const [images, setImages] = useState({});
  const [emotionalMessages, setEmotionalMessages] = useState(null);
  const [sentimentImage, setSentimentImage] = useState(null);
  const [sentimentAvgImage, setSentimentAvgImage] = useState(null);
  const [topWords, setTopWords] = useState(null);
  const [graficoEmociones, setGraficoEmociones] = useState(null);
  const [conteoToxicidad, setConteoToxicidad] = useState(null);
  const [userToken, setUserToken] = useState(null); // Guardamos el user_token dinámico
  const [wordCloud, setWordCloud] = useState(null);
  const [fetchingData, setFetchingData] = useState(false);
  

  
  // Función para manejar la selección de archivo
const handleFileChange = (e) => {
  setFile(e.target.files[0]);
};
  // Función para subir el archivo
  const handleUploadFile = async () => {
    if (!file) return Swal.fire("Selecciona un archivo.", "", "warning");
    
    setLoading(true); // Inicia la carga
    setFileUploaded(false); // Desactiva la visibilidad de los botones mientras se sube el archivo

    const formData = new FormData();
    formData.append("file", file);
  
    try {
      const response = await axios.post(`${API_URL}/upload`, formData);
  
      if (response.data.user_token) {
        setUserToken(response.data.user_token); // Guardamos el user_token
      }
  
      Swal.fire(response.data.message || response.data.error, "", response.data.error ? "error" : "success");
      setFileUploaded(true); // Los botones ya se pueden mostrar
    } catch (error) {
      console.error("Error al subir el archivo" , error);
      Swal.fire("Error al subir el archivo. Por favor, inténtalo de nuevo. Solo se pueden subir chats de Wats", "", "error");
      setFile(null); // Restablece el archivo para permitir un nuevo intento
    } finally {
      setLoading(false); // Detenemos la carga
    }
  };
  const fetchData = async (fetchFunction) => {
    setFetchingData(true);
    try {
      const data = await fetchFunction();
  
      if (!data || Object.keys(data).length === 0) {
        console.warn("⚠ No hay datos válidos para actualizar content.");
        return;
      }
  
      setContent(data);
    } catch (error) {
      console.error("❌ Error fetching data:", error);
      Swal.fire("Error al obtener los datos. Por favor, inténtalo de nuevo.", "", "error");
    } finally {
      setFetchingData(false);
    }
  };
  const fetchStats = async () => {
    if (!userToken) {
      Swal.fire("No hay user_token disponible. Sube un archivo primero.", "", "warning");
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/get_statistics?user_token=${userToken}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener estadísticas:", error.response?.data || error.message);
      Swal.fire("⚠️ No se pudieron obtener las estadísticas.", "", "error");
    }
  };
  

  const fetchWordCloud = async () => {
    if (!fecha) {
      Swal.fire("Selecciona una fecha antes de analizar.", "", "warning");
      return;
    }
  
    try {
      const response = await fetch(
        `${API_URL}/plot_nube_palabras.png?user_token=${userToken}&fecha=${fecha}`
      );
      
      if (response.status === 404) {
        setMensajeError(`⚠️ No hay mensajes para la fecha ${fecha}.`);
        setWordCloud(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Error al obtener la nube de palabras");
      }
      
      setWordCloud(response.url); // Guardar la URL de la imagen
      setShowDatePicker(false); // Cerrar el selector
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Hubo un problema al generar la nube de palabras.", "", "error");
    }
  };
  

  const fetchSentimentAnalysis = async () => {
    try {
      const response = await fetch(`${API_URL}/analisis_sentimientos?user_token=${userToken}`);
  
      if (response.status === 404) {
        setMensajeError("⚠️ No hay mensajes disponibles para analizar.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al obtener el análisis de sentimientos");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Hubo un problema al realizar el análisis de sentimientos.", "", "error");
    }
  };

  const fetchPlot = async () => {
    try {
      const response = await axios.get(`${API_URL}/plot.png?user_token=${userToken}`, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico plot.png", error);
      Swal.fire("Error al obtener el gráfico plot.png.", "", "error");
    }
  };
  
  const fetchTopEmojis = async () => {
    try {
      const response = await axios.get(`${API_URL}/top_emojis?user_token=${userToken}`);
      return response.data // Retorna la lista de emojis con sus datos
    } catch (error) {
      console.error("Error al obtener los datos de emojis", error);
      Swal.fire("Error al obtener los datos de emojis.", "", "error");
      return {};
    }
  };

  const fetchPlotDates = async () => {
    try {
      const response = await axios.get(`${API_URL}/plot_dates.png?user_token=${userToken}`, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico plot_dates.png", error);
      Swal.fire("Error al obtener el gráfico plot_dates.png.", "", "error");
    }
  };
  
  const fetchPlotMensajesAno = async () => {
    try {
      const response = await axios.get(`${API_URL}/plot_mensajes_año.png?user_token=${userToken}`, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico plot_mensajes_año.png", error);
      Swal.fire("Error al obtener el gráfico plot_mensajes_año.png.", "", "error");
    }
  };
  
  const fetchPlotMensajesMes = async () => {
    try {
      const response = await axios.get(`${API_URL}/plot_mensajes_mes.png?user_token=${userToken}`, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico plot_mensajes_mes.png", error);
      Swal.fire("Error al obtener el gráfico plot_mensajes_mes.png.", "", "error");
    }
  };
  
  const fetchPlotHorasCompleto = async () => {
    try {
      const response = await axios.get(`${API_URL}/plot_horas_completo.png?user_token=${userToken}`, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico plot_horas_completo.png", error);
      Swal.fire("Error al obtener el gráfico plot_horas_completo.png.", "", "error");
    }
  };
  
  const fetchPlotTimeline = async () => {
    try {
      const response = await axios.get(`${API_URL}/plot_timeline.png?user_token=${userToken}`, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico plot_timeline.png", error);
      Swal.fire("Error al obtener el gráfico plot_timeline.png.", "", "error");
    }
  };
  
  const fetchPlotMensajesPorDia = async () => {
    try {
      const response = await axios.get(`${API_URL}/plot_mensajes_por_dia.png?user_token=${userToken}`, { responseType: "blob" });
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico plot_mensajes_por_dia.png", error);
      Swal.fire("Error al obtener el gráfico plot_mensajes_por_dia.png.", "", "error");
    }
  };

  const fetchEmotionalMessages = async () => {
    try {
      const response = await fetch(`${API_URL}/mensajes_mayor_emocion?user_token=${userToken}`);
  
      if (response.status === 404) {
        setMensajeError("⚠️ No hay mensajes disponibles para analizar.");
        return;
      }
  
      if (!response.ok) {
        throw new Error("Error al obtener los mensajes con mayor emoción");
      }
      return await response.json();
    } catch (error) {
      console.error("Error:", error);
      Swal.fire("Hubo un problema al obtener los mensajes con mayor emoción.", "", "error");
    }
  };
  
  const fetchConteoToxicidad = async () => {
    if (!userToken) {
      Swal.fire("No hay user_token disponible. Sube un archivo primero.", "", "warning");
      return;
    }
  
    try {
      const response = await axios.get(`${API_URL}/conteo_toxicidad?user_token=${userToken}`);
      return response.data;
    } catch (error) {
      console.error("❌ Error al obtener conteo de toxicidad:", error.response?.data || error.message);
      Swal.fire("⚠️ No se pudo obtener el conteo de toxicidad.", "", "error");
      return {}; // Devuelve un objeto vacío si hay error
    }
  };
  


  

  const fetchGraficoEmociones = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/grafico_emociones.png?user_token=${userToken}`, 
        { responseType: "blob" }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico de emociones", error);
      if (error.response && error.response.status === 404) {
        Swal.fire("⚠️ No hay datos de emociones disponibles para este usuario.", "", "warning");
      } else {
        Swal.fire("Error al obtener el gráfico de emociones.", "", "error");
      }
    }
  };
 

  const fetchSentimentAvgGraph = async () => {
    if (!userToken) {
      Swal.fire("Falta el user_token. Sube un archivo primero.", "", "warning");
      return;
    }
  
    try {
      const response = await axios.get(
        `${API_URL}/sentimiento_promedio_dia.png?user_token=${userToken}`,
        { responseType: "blob" }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico de sentimiento promedio por día", error);
      Swal.fire("Error al obtener el gráfico de sentimiento promedio por día.", "", "error");
    }
  };


  const fetchTopWordsSentiment = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/top_palabras_usuario?user_token=${userToken}`
      );
      
      return response.data;
    } catch (error) {
      console.error("Error al obtener las palabras más usadas", error);
      Swal.fire("Error al obtener las palabras más usadas.", "", "error");
    }
  };

  const fetchGraficoEvolucionSentimientos = async () => {
    try {
      const response = await axios.get(
        `${API_URL}/sentimientos_por_dia.png?user_token=${userToken}`, 
        { responseType: "blob" }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico de evolución de sentimientos", error);
      Swal.fire("Error al obtener el gráfico de evolución de sentimientos.", "", "error");
    }
  };


  return (
    <div className="container">
      {/* Muestra el título y la subida de archivos SOLO si aún no se ha subido el archivo */}
      {!fileUploaded && (
        <>
          <h1 className="title-S">Subir Archivo</h1>
          <p className="description-S">
            Analiza chats de WhatsApp.
            Para usarlo solo ve al chat de WhatsApp que quieras analizar , le das click a los 3 puntitos de la parte superior derecha, haces click en "Mas" y le das a la opcion de "Exportar Chat" y lo exportas sin archivos multimedia. El arhcivo .zip lo subes y listo.
          </p>
    
          {!file ? (
            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                id="fileInput"
                className="file-input"
              />
              <label htmlFor="fileInput" className="file-label">
                Seleccionar Archivo (.zip)
              </label>
            </div>
          ) : (
            <button onClick={handleUploadFile} className="upload-button" disabled={loading}>
              {loading ? "Cargando..." : "Subir Archivo"}
            </button>
          )}
    
          {loading && (
            <div className="loading-container">
              <div className="spinner"></div>
              <span className="loading-text">Cargando...</span>
            </div>
          )}
        </>
      )}
      

      {fileUploaded && !loading && (
        // Una vez que el archivo ha sido subido correctamente, muestra los botones adicionales
    <div className="mt-6 mb-6">
    <button onClick={() => fetchData(fetchStats)} className="btn-green" disabled={fetchingData}>Estadisticas Generales</button>
    <button onClick={() => fetchData(fetchTopWordsSentiment)} className="btn-green" disabled={fetchingData}>Palabras más Usadas</button>
    <button onClick={() => fetchData(fetchSentimentAnalysis)} className="btn-red" disabled={fetchingData}>Estadistica del chat</button>
    <button onClick={() => fetchData(fetchEmotionalMessages)} className="btn-orange" disabled={fetchingData}>Mensajes Emocionales</button>
    <button onClick={() => fetchData(fetchConteoToxicidad)} className="btn-red" disabled={fetchingData}>Conteo de Malas Palabras</button>
    <button onClick={() => fetchData(fetchPlot)} className="btn-purple" disabled={fetchingData}>Grafico de Actividad por dia</button>
    <button onClick={() => fetchData(fetchTopEmojis)} className="btn-purple" disabled={fetchingData}>Grafico de conteo de emojis</button>
    <button onClick={() => fetchData(fetchPlotDates)} className="btn-purple" disabled={fetchingData}>Grafico de dias mas activos</button>
    <button onClick={() => fetchData(fetchPlotMensajesAno)} className="btn-purple" disabled={fetchingData}>Gráfico de Mensajes Año</button>
    <button onClick={() => fetchData(fetchPlotMensajesMes)} className="btn-purple" disabled={fetchingData}>Gráfico de Mensajes Mes</button>
    <button onClick={() => fetchData(fetchPlotHorasCompleto)} className="btn-purple" disabled={fetchingData}>Gráfico de Horas Completo</button>
    <button onClick={() => fetchData(fetchPlotTimeline)} className="btn-purple" disabled={fetchingData}>Timeline de Mensajes</button>
    <button onClick={() => fetchData(fetchPlotMensajesPorDia)} className="btn-purple" disabled={fetchingData}>Gráfico de Mensajes por Día</button>    
    <button onClick={() => fetchData(fetchSentimentAvgGraph)} className="btn-blue" disabled={fetchingData}>Grafica de Dias de mayor carga emocional</button>
    <button onClick={() => fetchData(fetchGraficoEmociones)} className="btn-blue" disabled={fetchingData}>Gráfico de Emociones</button>
    <button onClick={() => fetchData(fetchGraficoEvolucionSentimientos)} className="btn-red" disabled={fetchingData}>Grafico de Sentimiento por dia</button>
    <button onClick={() => setShowDatePicker(true)} className="btn-yellow mt-3" disabled={fetchingData}>Generar Nube de Palabras</button>
  </div>
      )}

{fetchingData && (
  <div className="loading-screen">
    <div className="spinner"></div>
    <div className="message">Analizando datos... Espere por favor</div>
  </div>
)}

{content && (
  <div className="mt-6 w-full max-w-3xl">
    <div className="p-4 bg-white rounded-lg shadow-md">
      {typeof content === "string" ? (
        <img src={content} alt="Gráfico" className="w-full h-auto rounded-lg" />
      ) : content.total_mensajes ? (
        <ChatStats stats={content} />
      ) : content.top_palabras_por_usuario ? (
        <TopWords topPalabras={{ top_palabras_por_usuario: content.top_palabras_por_usuario }} />
      ):  content.top_emojis   ? (
        <>
          <EmojiChart emojiData={content} />
        </>
      ) : content.positivo && content.neutro && content.negativo ? (
        <SentimentStats sentiment={content} />
      ) : content.mensajes_mas_positivos ? (
        <EmotionalMessages emotionalMessages={content} />
      ) : content.conteo_toxicidad ? (
        <>
          {console.log("📌 Renderizando OffensiveWords con:", content.conteo_toxicidad)}
          <OffensiveWords data={content.conteo_toxicidad} />
        </>
      ) 
     : (
        <pre>{JSON.stringify(content, null, 2)}</pre>
      )}
    </div>
  </div>
)}




{showDatePicker && (
  <div className="mt-6 w-full max-w-3xl">
    <div className="p-4 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-xl font-bold text-gray-800 mb-4">📅 Selecciona una fecha</h2>
      
      <input
        type="date"
        value={fecha}
        onChange={(e) => setFecha(e.target.value)}
        className="p-3 border rounded-lg w-full shadow-sm focus:ring-2 focus:ring-yellow-400"
      />

<div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
        <button
          onClick={fetchWordCloud}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#38a169', color: 'white', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}
        >
          🔍 Analizar
        </button>
        
        <button
          onClick={() => setShowDatePicker(false)}
          style={{ padding: '0.5rem 1rem', backgroundColor: '#e53e3e', color: 'white', borderRadius: '0.5rem', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', cursor: 'pointer' }}
        >
          ❌ Cancelar
        </button>
      </div>
    </div>
  </div>
)}

{/* Mensaje de error si no hay mensajes para esa fecha */}
{mensajeError && (
  <div className="mt-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
    {mensajeError}
  </div>
)}

{wordCloud && (
  <div className="mt-6 w-full max-w-3xl">
    <div className="p-4 bg-white rounded-lg shadow-lg text-center">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">☁️ Nube de Palabras</h2>
      <div className="border-2 border-gray-300 rounded-lg p-2 bg-gray-50">
        <img src={wordCloud} alt="Nube de Palabras" className="w-full rounded-lg shadow-md" />
      </div>
      <button
        onClick={() => setWordCloud(null)}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg shadow hover:bg-red-600"
      >
        ❌ Cerrar Nube
      </button>
    </div>
  </div>
)}
{Object.keys(images).length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          {Object.entries(images).map(([name, src]) => (
            <div key={name} className="border p-2 rounded-lg shadow-md text-center">
              <h2 className="text-sm font-semibold mb-2">{name.replace(".png", "").replace("plot_", "").replace("_", " ")}</h2>
              <img src={src} alt={name} className="w-full h-auto rounded-lg" />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default App;
import React, { useState } from "react";
import axios from "axios";
import ChatStats from "./components/ChatStats";
import TopWords from "./components/TopWords";
import EmotionalMessages from "./components/EmotionalMessages";
import SentimentStats from "./components/SentimentStats";
import Swal from "sweetalert2";
import OffensiveWords from "./components/OffensiveWords";
import withReactContent from "sweetalert2-react-content";
import EmojiChart from "./components/EmojiChart";
import "./index.css"; // Asegúrate de importar los estilos
import ActivityChart from "./components/ActivityChart";
import TopActiveDaysChart from "./components/TopActiveDaysChart";
import MessagesByYearChart from "./components/MessagesByYearChart";
import MessagesByMonthChart from "./components/MessagesByMonthChart";
import TimelineChart from "./components/TimelineChart";
import MessagesTimeline from "./components/MessagesTimeline";
import WordCloudChart from "./components/WordCloudChart";
import SentimentAvgGraph from "./components/SentimentAvgGraph";
import EvolucionSentimientosChart from "./components/EvolucionSentimientosChart";
import HorasMensajesChart from "./components/HorasMensajesChart";

//const API_URL = "http://localhost:5000";
//RENDER
const API_URL = "https://analyzer-chat-back.onrender.com";
//
const MySwal = withReactContent(Swal);

function App() {
  const [wordCloudData, setWordCloudData] = useState([]);

  const [data, setData] = useState({ timeline: [], top_days: [] }); // ✅ Inicializa `top_days` como array vacío
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);
  const [showMessage, setShowMessage] = useState(false);
  const [selectedTitle, setSelectedTitle] = useState(""); // Estado para el título
  const [activeComponent, setActiveComponent] = useState(null);
  const [topEmojis, setTopEmojis] = useState(null); // Estado inicial
  const [topEmojisPorUsuario, setTopEmojisPorUsuario] = useState(null); // Estado inicial
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [mensajeError, setMensajeError] = useState("");
  const [graficoEvolucionSentimientos, setGraficoEvolucionSentimientos] =
    useState(null);
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

  const handleButtonClick = () => {
    fetchData(fetchWordCloud, "📅 Nube de Palabras"); // 🔹 Llamar a fetchData
    setShowDatePicker(true); // 🔹 Mostrar el input cuando se haga clic en el botón
  };

  // Función para manejar la selección de archivo
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  // Función para subir el archivo
  const handleUploadFile = async () => {
    if (!file) return Swal.fire("Selecciona un archivo.", "", "warning");

    setLoading(true);
    setFileUploaded(false);
    setShowMessage(false); // Mostramos el mensaje después de subir el archivo

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.user_token) {
        setUserToken(data.user_token);
      }

      Swal.fire(
        data.message || data.error,
        "",
        data.error ? "error" : "success"
      );
      setFileUploaded(true);
      setShowMessage(true); // Mostramos el mensaje después de subir el archivo
    } catch (error) {
      console.error("Error al subir el archivo", error);
      Swal.fire("Error al subir el archivo. Inténtalo de nuevo.", "", "error");
      setFile(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchData = async (fetchFunction, title) => {
    setFetchingData(true);
    setSelectedTitle(title); // Actualizar el título antes de hacer la petición
    setShowMessage(false); // Ocultamos el mensaje cuando el usuario hace clic en un botón

    try {
      const data = await fetchFunction();
      setContent(data);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire(
        "Error al obtener los datos. Por favor, inténtalo de nuevo.",
        "",
        "error"
      );
    } finally {
      setFetchingData(false);
    }
  };

  const fetchStats = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/get_statistics?user_token=${userToken}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error al obtener estadísticas:",
        error.response?.data || error.message
      );
      Swal.fire("⚠️ No se pudieron obtener las estadísticas.", "", "error");
    }
  };

  const fetchSentimentAnalysis = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/analisis_sentimientos?user_token=${userToken}`
      );

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
      Swal.fire(
        "Hubo un problema al realizar el análisis de sentimientos.",
        "",
        "error"
      );
    }
  };

  const fetchPlot = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot.json?user_token=${userToken}`
      );
      return response.data; // Si la petición es exitosa, devuelve los datos.
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Error al obtener los datos",
        text: "Hubo un problema al cargar la información del gráfico. Inténtalo nuevamente.",
        confirmButtonText: "Aceptar",
      });

      return { error: true }; // Devuelve un objeto de fallback en lugar de dejar vacío
    }
  };

  const fetchTopEmojis = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/top_emojis?user_token=${userToken}`
      );
      return response.data; // Retorna la lista de emojis con sus datos
    } catch (error) {
      console.error("Error al obtener los datos de emojis", error);
      Swal.fire("Error al obtener los datos de emojis.", "", "error");
      return {};
    }
  };

  const fetchPlotDates = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_dates.json?user_token=${userToken}`
      );

      return response.data; // Retorna los datos ya en formato JSON
    } catch (error) {
      console.error("Error al obtener los datos de actividad", error);
      Swal.fire("Error al obtener los datos de actividad.", "", "error");
      return [];
    }
  };

  const fetchPlotMensajesAno = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_mensajes_año.json?user_token=${userToken}`
      );

      if (response.data.error) {
        throw new Error(response.data.error);
      }

      return response.data; // 👈 Devuelve los datos JSON correctamente
    } catch (error) {
      console.error("Error al obtener los datos de mensajes por año:", error);
      Swal.fire("Error al obtener los datos de mensajes por año.", "", "error");
      return null;
    }
  };

  const fetchPlotMensajesMes = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_mensajes_mes.json?user_token=${userToken}`
      );

      if (response.data && response.data.mensajes_por_mes) {
        return response.data; // Devuelve los datos correctamente
      } else {
        throw new Error("Respuesta inválida del servidor.");
      }
    } catch (error) {
      console.error("Error al obtener los datos de mensajes por mes", error);
      Swal.fire("Error al obtener los datos de mensajes por mes.", "", "error");
      return null;
    }
  };

  const fetchPlotHorasCompleto = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/horas_completo.json?user_token=${userToken}`
      );

      console.log("Respuesta de la API:", response.data); // 👀 Verifica qué devuelve la API

      if (!response.data || !response.data.datos_horas) {
        throw new Error("Datos de horas_completo.json no válidos");
      }

      return response.data; // 🔹 Devuelve el array con los datos
    } catch (error) {
      console.error("Error al obtener los datos de horas_completo.json", error);
      Swal.fire("Error al obtener los datos del gráfico.", "", "error");
      return []; // 🔹 Devuelve un array vacío en caso de error
    }
  };

  const fetchPlotTimeline = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_timeline.json?user_token=${userToken}`
      );
      return response.data; // Devolvemos el JSON directamente
    } catch (error) {
      console.error("Error al obtener los datos de la línea temporal", error);
      Swal.fire(
        "Error al obtener los datos de la línea temporal.",
        "",
        "error"
      );
      return null; // Retornamos null en caso de error
    }
  };
  const fetchPlotMensajesPorDia = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_mensajes_por_dia.json?user_token=${userToken}`
      );

      console.log("🔍 Respuesta de la API:", response.data);

      return response.data;
    } catch (error) {
      console.error(
        "❌ Error al obtener los datos de mensajes por día:",
        error
      );
      Swal.fire("Error al obtener los datos de mensajes por día.", "", "error");
      return { timeline: [], top_days: [] };
    }
  };

  const fetchEmotionalMessages = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/mensajes_mayor_emocion?user_token=${userToken}`
      );

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
      Swal.fire(
        "Hubo un problema al obtener los mensajes con mayor emoción.",
        "",
        "error"
      );
    }
  };

  const fetchConteoToxicidad = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    if (!userToken) {
      Swal.fire(
        "No hay user_token disponible. Sube un archivo primero.",
        "",
        "warning"
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/conteo_toxicidad?user_token=${userToken}`
      );
      return response.data;
    } catch (error) {
      console.error(
        "❌ Error al obtener conteo de toxicidad:",
        error.response?.data || error.message
      );
      Swal.fire("⚠️ No se pudo obtener el conteo de toxicidad.", "", "error");
      return {}; // Devuelve un objeto vacío si hay error
    }
  };

  const fetchGraficoEmociones = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/grafico_emociones.png?user_token=${userToken}`,
        { responseType: "blob" }
      );
      return URL.createObjectURL(response.data);
    } catch (error) {
      console.error("Error al obtener el gráfico de emociones", error);
      if (error.response && error.response.status === 404) {
        Swal.fire(
          "⚠️ No hay datos de emociones disponibles para este usuario.",
          "",
          "warning"
        );
      } else {
        Swal.fire("Error al obtener el gráfico de emociones.", "", "error");
      }
    }
  };

  const fetchSentimentAvgGraph = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    if (!userToken) {
      Swal.fire("Falta el user_token. Sube un archivo primero.", "", "warning");
      return null;
    }

    try {
      const response = await axios.get(
        `${API_URL}/sentimiento_promedio_dia?user_token=${userToken}`
      );

      // Verificar si la respuesta fue exitosa y contiene los datos esperados
      if (response.status === 200 && response.data?.top_dias?.length > 0) {
        console.log("Días con mayor carga emocional:", response.data.top_dias);
        return response.data;
      } else {
        throw new Error("No se encontraron datos de sentimiento.");
      }
    } catch (error) {
      console.error(
        "Error al obtener el gráfico de sentimiento promedio por día:",
        error
      );
      Swal.fire(
        "Error al obtener el gráfico de sentimiento promedio por día.",
        "",
        "error"
      );
      return null;
    }
  };
  const fetchTopWordsSentiment = async () => {
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
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
    if (!userToken) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/sentimientos_por_dia.json?user_token=${userToken}`
      );

      console.log(
        "📊 Datos recibidos en fetchGraficoEvolucionSentimientos:",
        response.data
      );

      if (!response.data || !response.data.datos) {
        throw new Error("Datos no disponibles");
      }

      return response.data; // Devolvemos los datos JSON directamente
    } catch (error) {
      console.error("Error al obtener la evolución de sentimientos", error);
      Swal.fire("Error al obtener la evolución de sentimientos.", "", "error");
      return []; // Devolvemos un array vacío en caso de error
    }
  };

  const fetchDataAndSetTitle = async (fetchFunction, title) => {
    setSelectedTitle(title); // Cambia el título
    const data = await fetchFunction(); // Llama a la API
    setContent(data); // Guarda la data obtenida
  };

  const fetchWordCloud = async (fechaSeleccionada) => {
    if (!fechaSeleccionada) {
      console.warn(
        "⚠️ No hay fecha seleccionada, no se ejecutará la petición."
      );
      return;
    }

    try {
      setFetchingData(true);
      const response = await fetch(
        `${API_URL}/nube_palabras?user_token=${userToken}&fecha=${fechaSeleccionada}`
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Error desconocido al obtener la nube de palabras"
        );
      }

      if (!data.palabras || Object.keys(data.palabras).length === 0) {
        Swal.fire(
          `⚠️ No hay mensajes para la fecha ${fechaSeleccionada}.`,
          "",
          "warning"
        );
        setWordCloudData(null);
        return;
      }

      console.log("📥 Datos recibidos:", data);

      // Convertir objeto a array y ordenar de mayor a menor frecuencia
      const wordArray = Object.entries(data.palabras)
        .map(([palabra, valor]) => ({
          text: palabra,
          value: valor,
        }))
        .sort((a, b) => b.value - a.value);

      console.log("📊 Palabras ordenadas:", wordArray);
      setWordCloudData(wordArray);
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire(error.message, "", "error");
    } finally {
      setFetchingData(false);
    }
  };

  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo-container">
          <img src="/Sylas_0.jpg" alt="Logo" className="logo" />
          <span className="logo-text">Analizador de Chat</span>
        </div>
        <button
          onClick={() =>
            fetchData(fetchStats, "📊 Estadísticas Generales del Chat")
          }
        >
          📊 Estadísticas Generales del Chat
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchTopWordsSentiment,
              "📝 Palabras más usadas por autores"
            )
          }
        >
          📝 Palabras más usadas por autores
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchSentimentAnalysis,
              "📈 Grafico de barras de sentimientos del chat"
            )
          }
        >
          📊 Grafico de barras de sentimientos del chat
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchPlot,
              "📊 Gráfico de barras del total de mensajes por dias "
            )
          }
        >
          📊 Gráfico de barras del total de mensajes por dias
        </button>
        <button
          onClick={() => fetchData(fetchTopEmojis, "😊 Gráfico de Emojis")}
        >
          😊 Gráfico de Emojis
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchPlotDates,
              "📊 Grafico de barras de Dias de Mayor actividad del chat"
            )
          }
        >
          📊 Grafico de barras de Dias de Mayor actividad del chat
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchPlotMensajesAno,
              "📊 Grafico Mensajes por años del chat"
            )
          }
        >
          📊 Grafico Mensajes por años del chat
        </button>
        <button
          onClick={() =>
            fetchData(fetchPlotMensajesMes, "📊 Gráfico de mensajes por mes")
          }
        >
          📊 Gráfico de mensajes por mes
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchPlotTimeline,
              "📈 Gráfico Lineal de mensajes por año "
            )
          }
        >
          📈 Gráfico Lineal de mensajes por año
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchPlotMensajesPorDia,
              "📈 Gráfico Lineal de mensajes por dia "
            )
          }
        >
          📈 Gráfico Lineal de mensajes por dia
        </button>
        {/* y 
        <button
          onClick={() => fetchData(fetchWordCloud, "📅 Nube de Palabras")}
        >
          📅 Nube de Palabras
        </button>
        */}
        <button
          onClick={() =>
            fetchData(
              fetchSentimentAvgGraph,
              "📊 Grafico de sentimientos negativos y positivos por dia"
            )
          }
        >
          📊 Grafico de sentimientos negativos y positivos por dia
        </button>

        <button
          onClick={() =>
            fetchData(
              fetchGraficoEvolucionSentimientos,
              "Gráfico de carga emocional de mensajes por dia"
            )
          }
        >
          📅 Gráfico de carga emocional de mensajes por dia
        </button>
        <button
          onClick={() =>
            fetchData(
              fetchPlotHorasCompleto,
              "📊 Gráfico de horas de mas actividad del chat"
            )
          }
        >
          📊 Gráfico de horas de mas actividad del chat
        </button>
        <button
          onClick={() =>
            fetchData(fetchConteoToxicidad, "📅 Palabras Toxicas por Usuario")
          }
        >
          📅 Palabras Toxicas por Usuario
        </button>
      </div>

      {/* Contenido Principal */}
      <div className="main-content expanded">
        {/* Sección de subida de archivo (solo visible si no se ha subido) */}
        {!fileUploaded && !content && (
          <div className="upload-section">
            <h1>Subir Archivo</h1>
            <p>
              Analiza chats de WhatsApp. Exporta el chat sin archivos multimedia
              y súbelo aquí.
            </p>

            <div className="file-input-wrapper">
              <input
                type="file"
                accept=".zip, .txt"
                onChange={handleFileChange}
                id="fileInput"
                className="file-input"
                style={{ display: "none" }}
              />
              <label htmlFor="fileInput" className="file-label">
                📂 Seleccionar Archivo (.zip o .txt)
              </label>
            </div>

            {file && (
              <button
                onClick={handleUploadFile}
                className="upload-button"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Subir Archivo"}
              </button>
            )}
          </div>
        )}
        {fetchingData && (
          <div className="loading-screen">
            <div className="spinner"></div>
            <div className="message">Analizando datos... Espere por favor</div>
          </div>
        )}
        {/* Mostrar mensaje solo después de subir un archivo y antes de presionar un botón */}
        {fileUploaded && showMessage && !content && (
          <div className="empty-state">
            <h2>👋 ¡Bienvenido!</h2>
            <p>Haga click en un botón para probar la app.</p>
          </div>
        )}

        {/* Contenedor de contenido */}

        {content && (
          <div className="content-container">
            <h2>{selectedTitle || "📊 Aquí aparecerán los gráficos"}</h2>

            <div className="mt-6 w-full max-w-7xl">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                {typeof content === "string" ? (
                  <img
                    src={content}
                    alt="Gráfico"
                    className="w-full h-auto rounded-lg"
                  />
                ) : content && content.resumen_general ? (
                  <ChatStats stats={content} />
                ) : content.top_palabras_por_usuario ? (
                  <TopWords
                    topPalabras={{
                      top_palabras_por_usuario:
                        content.top_palabras_por_usuario,
                    }}
                  /> //fetchTopWordsSentiment
                ) : content.top_emojis ? (
                  <EmojiChart emojiData={content} /> //fetchTopEmojis
                ) : content.positivo && content.neutro && content.negativo ? (
                  <SentimentStats sentiment={content} /> //fetchSentimentAnalysis
                ) : content.mensajes_mas_positivos ? (
                  <EmotionalMessages emotionalMessages={content} /> //fetchEmotionalMessages
                ) : content.conteo_toxicidad ? (
                  <OffensiveWords data={content.conteo_toxicidad} /> //fetchConteoToxicidad
                ) : content.activity_per_day ? (
                  <ActivityChart activityData={content.activity_per_day} /> //fetchPlot
                ) : content.top_active_days ? (
                  <TopActiveDaysChart data={content.top_active_days} /> //fetchPlotDates
                ) : content.mensajes_por_año ? (
                  <MessagesByYearChart data={content.mensajes_por_año} /> //fetchPlotMensajesAno
                ) : content.mensajes_por_mes ? (
                  <MessagesByMonthChart data={content.mensajes_por_mes} /> //fetchPlotMensajesMes
                ) : content.timeline ? (
                  <TimelineChart timelineData={content.timeline} /> //fetchPlotTimeline
                ) : content.timelineDay ? (
                  <MessagesTimeline
                    timelineDataDay={content.timelineDay}
                    topDays={content.top_days}
                    bottomDays={content.bottom_days} //fetchPlotMensajesPorDia
                  /> //fetchPlotMensajesPorDia
                ) : content.palabras &&
                  Object.keys(content.palabras).length > 0 ? (
                  <WordCloudChart fetchWordCloud={fetchWordCloud} />
                ) : content.top_dias ? (
                  <SentimentAvgGraph sentimentData={content.top_dias} /> //fetchSentimentAvgGraph
                ) : content.datos ? (
                  <EvolucionSentimientosChart
                    evolucionSentimientosData={content.datos}
                  /> //fetchGraficoEvolucionSentimientos
                ) : content.datos_horas ? (
                  <HorasMensajesChart datos_horas={content.datos_horas} /> //fetchPlotHorasCompleto
                ) : (
                  null(<pre>{JSON.stringify(content, null, 2)}</pre>)
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

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
import WordCountByUser from "./components/WordCountByUser"; // ajusta el path si está en otra carpeta
import AutorReanudaChart from "./components/AutorReanudaChart"; // o ajusta la ruta si está en otra carpeta

//const API_URL = "http://localhost:5000";
//RENDER
const API_URL = "https://analyzer-chat-back.onrender.com";
//
const MySwal = withReactContent(Swal);

function App() {
  const [wordCloudData, setWordCloudData] = useState([]);
  const [fechaSeleccionada, setFechaSeleccionada] = useState(""); // 🗓️ Para la fecha de la nube
  const [mostrarSelectorNube, setMostrarSelectorNube] = useState(false);
  const [data, setData] = useState({ timeline: [], top_days: [] }); // ✅ Inicializa `top_days` como array vacío
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
  const [archivoChatId, setarchivoChatId] = useState(null); // Guardamos el archivoChatId dinámico
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

      if (data.archivo_chat_id) {
        setarchivoChatId(data.archivo_chat_id);
        console.log("📦 ID recibido:", data.archivo_chat_id);
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/get_statistics?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/analisis_sentimientos?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot.json?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/top_emojis?archivo_chat_id=${archivoChatId}`
      );
      return response.data; // Retorna la lista de emojis con sus datos
    } catch (error) {
      console.error("Error al obtener los datos de emojis", error);
      Swal.fire("Error al obtener los datos de emojis.", "", "error");
      return {};
    }
  };

  const fetchPlotDates = async () => {
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_dates.json?archivo_chat_id=${archivoChatId}`
      );

      return response.data; // Retorna los datos ya en formato JSON
    } catch (error) {
      console.error("Error al obtener los datos de actividad", error);
      Swal.fire("Error al obtener los datos de actividad.", "", "error");
      return [];
    }
  };

  const fetchPlotMensajesAno = async () => {
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_mensajes_año.json?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_mensajes_mes.json?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/horas_completo.json?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_timeline.json?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/plot_mensajes_por_dia.json?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await fetch(
        `${API_URL}/mensajes_mayor_emocion?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    if (!archivoChatId) {
      Swal.fire(
        "No hay archivoChatId disponible. Sube un archivo primero.",
        "",
        "warning"
      );
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/conteo_toxicidad?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/grafico_emociones.png?archivo_chat_id=${archivoChatId}`,
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    if (!archivoChatId) {
      Swal.fire(
        "Falta el archivoChatId. Sube un archivo primero.",
        "",
        "warning"
      );
      return null;
    }

    try {
      const response = await axios.get(
        `${API_URL}/sentimiento_promedio_dia?archivo_chat_id=${archivoChatId}`
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
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/top_palabras_usuario?archivo_chat_id=${archivoChatId}`
      );

      return response.data;
    } catch (error) {
      console.error("Error al obtener las palabras más usadas", error);
      Swal.fire("Error al obtener las palabras más usadas.", "", "error");
    }
  };

  const fetchGraficoEvolucionSentimientos = async () => {
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }
    try {
      const response = await axios.get(
        `${API_URL}/sentimientos_por_dia.json?archivo_chat_id=${archivoChatId}`
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
      Swal.fire("Selecciona una fecha primero.", "", "warning");
      return;
    }

    try {
      setFetchingData(true);
      const response = await fetch(
        `${API_URL}/nube_palabras?archivo_chat_id=${archivoChatId}&fecha=${fechaSeleccionada}`
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
        return;
      }

      const wordArray = Object.entries(data.palabras)
        .map(([palabra, valor]) => ({
          text: palabra,
          value: valor,
        }))
        .sort((a, b) => b.value - a.value);

      console.log("📊 Palabras ordenadas:", wordArray);

      setWordCloudData(wordArray);
      return wordArray; // ⬅️ AGREGA ESTO
    } catch (error) {
      console.error("❌ Error:", error);
      Swal.fire(error.message, "", "error");
    } finally {
      setFetchingData(false);
    }
  };

  const fetchConteoPalabra = async () => {
    if (!archivoChatId) {
      Swal.fire("Sube un archivo primero.", "", "warning");
      return;
    }

    const palabra = prompt("¿Qué palabra quieres buscar?");
    if (!palabra) {
      Swal.fire("Debes ingresar una palabra para buscar.", "", "info");
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `${API_URL}/contar_palabra?archivo_chat_id=${archivoChatId}&palabra=${palabra}`
      );

      if (!response.data) {
        throw new Error("No se encontró respuesta válida");
      }

      setSelectedTitle(`🔠 Conteo de: "${palabra}"`);
      setContent(response.data); // 👈 Fuerza re-render con el nuevo resultado
    } catch (error) {
      console.error("Error al contar palabra:", error);
      Swal.fire("Error al contar la palabra.", "", "error");
    } finally {
      setLoading(false); // ✅ Ocultar loading pase lo que pase
    }
  };

  const fetchAutorReanudaMas = async (archivoChatId) => {
    const response = await axios.get(
      `${API_URL}/autor_que_reanuda_mas?archivo_chat_id=${archivoChatId}`
    );
    return { tipo: "reanuda", ...response.data };
  };

  const fetchNubePalabras = async (archivoChatId, fecha = "") => {
    let url = `${API_URL}/nube_palabras?archivo_chat_id=${archivoChatId}`;
    if (fecha) {
      url += `&fecha=${fecha}`;
    }

    const response = await axios.get(url);
    return response.data;
  };
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        {/* —————— HEADER (logo + título) —————— */}
        <div className="sidebar-header">
          <img src="/tralalero.jpg  " alt="Logo" className="logo" />
          <span className="logo-text">Analizador de Chat</span>
        </div>

        <div className="sidebar-buttons">
          <button
            onClick={() =>
              fetchData(fetchStats, "📊 Estadísticas Generales del Chat")
            }
          >
            📊 Estadísticas Generales del Chat
          </button>

          {/* === GRÁFICOS DE BARRAS === */}
          <button
            onClick={() =>
              fetchData(
                fetchPlot,
                "📊 Gráfico de barras del total de mensajes por dias"
              )
            }
          >
            📊 Gráfico de barras del total de mensajes por dias
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
                "📈 Gráfico de barras de sentimientos del chat"
              )
            }
          >
            📈 Gráfico de barras de sentimientos del chat
          </button>
          <button
            onClick={() => fetchData(fetchTopEmojis, "😊 Gráfico de Emojis")}
          >
            😊 Gráfico de Emojis
          </button>
          <button
            onClick={() =>
              fetchData(fetchPlotDates, "📊 Gráfico de Días de Mayor Actividad")
            }
          >
            📊 Gráfico de Días de Mayor Actividad
          </button>
          <button
            onClick={() =>
              fetchData(fetchPlotMensajesAno, "📊 Gráfico de Mensajes por Año")
            }
          >
            📊 Gráfico de Mensajes por Año
          </button>
          <button
            onClick={() =>
              fetchData(fetchPlotMensajesMes, "📊 Gráfico de Mensajes por Mes")
            }
          >
            📊 Gráfico de Mensajes por Mes
          </button>
          <button
            onClick={() =>
              fetchData(fetchPlotHorasCompleto, "📊 Horas de más actividad")
            }
          >
            📊 Horas de más actividad
          </button>

          {/* === GRÁFICOS LINEALES === */}
          <button
            onClick={() =>
              fetchData(
                fetchPlotTimeline,
                "📈 Gráfico Lineal de Mensajes por Año"
              )
            }
          >
            📈 Gráfico Lineal de Mensajes por Año
          </button>
          <button
            onClick={() =>
              fetchData(
                fetchPlotMensajesPorDia,
                "📈 Gráfico Lineal de Mensajes por Día"
              )
            }
          >
            📈 Gráfico Lineal de Mensajes por Día
          </button>

          {/* === FUNCIONALIDADES ESPECIALES === */}
          <button
            onClick={() =>
              fetchData(fetchConteoToxicidad, "📅 Palabras Tóxicas por Usuario")
            }
          >
            📅 Palabras Tóxicas por Usuario
          </button>
          <button onClick={() => setContent({ modo_conteo_palabra: true })}>
            🔠 Buscar Palabra por Usuario
          </button>
          <button
            onClick={() =>
              fetchData(
                () => fetchAutorReanudaMas(archivoChatId),
                "🔁 Reanudación de Conversación"
              )
            }
          >
            🔁 Reanudación de Conversación
          </button>

          {/* === OPCIONES COMENTADAS (mantener como están) === */}
          {/* 
<button
  onClick={() =>
    fetchData(
      fetchSentimentAvgGraph,
      "📊 Sentimientos positivos y negativos por día"
    )
  }
>
  📊 Sentimientos positivos y negativos por día
</button>

<button
  onClick={() =>
    fetchData(
      fetchGraficoEvolucionSentimientos,
      "📅 Carga emocional por día"
    )
  }
>
  📅 Carga emocional por día
</button>
*/}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="main-content expanded">
        {/* Sección de subida de archivo (solo visible si no se ha subido) */}
        {!fileUploaded && !content && (
          <div className="upload-section">
            <h1>¿Listo para descubrir todo lo que dice tu chat?</h1>

            <p>
              Analizamos emociones, palabras que más usas, quién inicia las
              conversaciones y mucho más. Obtén{" "}
              <strong>gráficos interactivos</strong> que revelan tu estilo al
              chatear.
              <strong>
                <p></p>
                Solo necesitas subir tu chat exportado (sin multimedia).
              </strong>
            </p>
            <div className="chat-export-steps">
              <h3>📲 ¿Cómo exportar tu chat de WhatsApp?</h3>
              <ol>
                <li>Abre la conversación de WhatsApp que quieres analizar.</li>
                <li>
                  Toca los <strong>tres puntos ⋮</strong> en la esquina superior
                  derecha.
                </li>
                <li>
                  Selecciona <strong>"Más"</strong> y luego{" "}
                  <strong>"Exportar chat"</strong>.
                </li>
                <li>
                  Cuando te pregunte, elige{" "}
                  <strong>“Sin archivos multimedia”</strong>.
                </li>
                <li>
                  Selecciona “Guardar en Archivos” o “Enviar por correo a ti
                  mismo”.
                </li>
                <li>
                  Asegúrate de tener el archivo <strong>.zip</strong> guardado
                  en tu dispositivo.
                </li>
                <li>
                  Regresa a esta página y{" "}
                  <strong>haz clic en “Subir archivo”</strong>.
                </li>
                <li>
                  Busca el archivo .zip que guardaste y súbelo para empezar el
                  análisis.
                </li>
              </ol>
            </div>
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
            <h2>🎉Bienvenido</h2>
            <p>
              Ahora puedes explorar tus estadísticas: emociones, palabras más
              usadas, quién habla más y mucho más.{" "}
              <strong>Haz clic en alguno los botones de para empezar.</strong>
            </p>
          </div>
        )}

        {/* Contenedor de contenido */}

        {content && (
          <div className="content-container">
            <h2>{selectedTitle || "📊 Aquí aparecerán los gráficos"}</h2>

            <div className="mt-6 w-full max-w-7xl">
              <div className="p-8 bg-white rounded-lg shadow-lg">
                {content.tipo === "nube_palabras" && mostrarSelectorNube && (
                  <div className="nube-palabras-controls">
                    <input
                      type="date"
                      value={fechaSeleccionada}
                      onChange={(e) => setFechaSeleccionada(e.target.value)}
                    />
                    <button
                      onClick={() => {
                        fetchData(
                          () => fetchWordCloud(fechaSeleccionada),
                          "☁️ Nube de Palabras"
                        );
                        setMostrarSelectorNube(false);
                      }}
                    >
                      🔍 Buscar en esa fecha
                    </button>
                  </div>
                )}
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
                ) : content.top_dias ? (
                  <SentimentAvgGraph sentimentData={content.top_dias} /> //fetchSentimentAvgGraph
                ) : content.datos ? (
                  <EvolucionSentimientosChart
                    evolucionSentimientosData={content.datos}
                  /> //fetchGraficoEvolucionSentimientos
                ) : content.datos_horas ? (
                  <HorasMensajesChart datos_horas={content.datos_horas} />
                ) : content.modo_conteo_palabra ? (
                  <WordCountByUser
                    archivoChatId={archivoChatId}
                    fetchPalabra={async (palabra) => {
                      const response = await axios.get(
                        `${API_URL}/contar_palabra?archivo_chat_id=${archivoChatId}&palabra=${palabra}`
                      );
                      return response.data;
                    }}
                  />
                ) : content.tipo === "reanuda" ? (
                  <AutorReanudaChart data={content} />
                ) : content.tipo === "nube_palabras" &&
                  !mostrarSelectorNube &&
                  wordCloudData ? (
                  <WordCloudChart palabras={wordCloudData} />
                ) : (
                  <pre>{JSON.stringify(content, null, 2)}</pre>
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

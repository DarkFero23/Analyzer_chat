import { useState } from "react";
import Swal from "sweetalert2";

const WordCloudChart = ({ fetchWordCloud }) => {
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null);

  const handleDateSelection = async () => {
    const { value: fecha } = await Swal.fire({
      title: "Selecciona una fecha",
      input: "date",
      inputLabel: "Fecha",
      inputPlaceholder: "YYYY-MM-DD",
      showCancelButton: true,
    });

    if (fecha) {
      setFechaSeleccionada(fecha);
      fetchWordCloud(fecha); // 🔹 Ahora llamamos a la API solo cuando hay fecha seleccionada
    }
  };

  return (
    <div>
      <button onClick={handleDateSelection}>📅 Seleccionar Fecha</button>
      {fechaSeleccionada && <p>📆 Fecha seleccionada: {fechaSeleccionada}</p>}
    </div>
  );
};

export default WordCloudChart;

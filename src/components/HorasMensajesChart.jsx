//BOTON: HORA DE MAS ACTIVIDAD
import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
  CartesianGrid,
} from "recharts";
import "./HorasMensajesChart.css";

const HORAS_COMPLETAS = [
  "12 a. m.",
  "1 a. m.",
  "2 a. m.",
  "3 a. m.",
  "4 a. m.",
  "5 a. m.",
  "6 a. m.",
  "7 a. m.",
  "8 a. m.",
  "9 a. m.",
  "10 a. m.",
  "11 a. m.",
  "12 p. m.",
  "1 p. m.",
  "2 p. m.",
  "3 p. m.",
  "4 p. m.",
  "5 p. m.",
  "6 p. m.",
  "7 p. m.",
  "8 p. m.",
  "9 p. m.",
  "10 p. m.",
  "11 p. m.",
];

const convertirHora = (horaTexto) => {
  const [hora, periodo] = horaTexto.split(" ");
  let horaNum = parseInt(hora, 10);
  if (periodo === "p.m." && horaNum !== 12) horaNum += 12;
  else if (periodo === "a.m." && horaNum === 12) horaNum = 0;
  return { horaNum, horaTexto };
};

const normalizarDatos = (datos_horas) => {
  const mapaDatos = new Map(datos_horas.map((d) => [d.hora, d.cantidad]));
  return HORAS_COMPLETAS.map((hora) => ({
    horaTexto: hora,
    cantidad: mapaDatos.get(hora) || 0,
    horaNum: convertirHora(hora).horaNum,
  }));
};

const HorasMensajesChart = ({ datos_horas = [] }) => {
  const datosNormalizados = normalizarDatos(datos_horas);
  const isMobile = window.innerWidth <= 480;

  return (
    <div className="horas-mensajes-chart-container">
      <h2 className="chart-title">📊 Mensajes por Hora</h2>
      <div className="chart-wrapper">
        <ResponsiveContainer width="100%" height={isMobile ? 700 : 500}>
          <BarChart
            data={datosNormalizados}
            margin={{
              top: 20,
              right: 30,
              left: 30,
              bottom: isMobile ? 120 : 80,
            }}
            barCategoryGap={isMobile ? 5 : 15}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.5} />
            <XAxis
              dataKey="horaTexto"
              tick={{
                fill: "#333",
                fontSize: isMobile ? 10 : 14,
                dx: -5, // 🔥 Mueve la etiqueta un poco a la izquierda
              }}
              angle={isMobile ? -90 : -45}
              textAnchor={isMobile ? "end" : "end"}
              interval={0}
              height={isMobile ? 130 : 60}
            />
            <YAxis
              tick={{ fill: "#333", fontSize: 12 }}
              label={{
                angle: -90,
                position: "insideLeft",
              }}
            />
            <Tooltip cursor={{ fill: "rgba(50, 205, 50, 0.2)" }} />
            <Legend />
            <Bar
              dataKey="cantidad"
              name="Mensajes"
              fill="#32CD32"
              barSize={isMobile ? 12 : 30}
              radius={[5, 5, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default HorasMensajesChart;

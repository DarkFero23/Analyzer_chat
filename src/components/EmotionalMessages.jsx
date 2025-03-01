import { Bar } from "react-chartjs-2";

const MensajesPorMesChart = ({ data }) => {
  if (!data || data.length === 0) return <p>No hay datos disponibles.</p>;

  const meses = data.map((item) => item.mes);
  const valores = data.map((item) => item.mensajes);

  const chartData = {
    labels: meses,
    datasets: [
      {
        label: "Mensajes por Mes",
        data: valores,
        backgroundColor: "#32CD32",
        borderRadius: 5,
      },
    ],
  };

  return (
    <div className="mensajes-mes-container">
      <h3>📅 Mensajes por Mes</h3>
      <Bar
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: { display: false },
          },
          scales: {
            x: {
              grid: { display: false },
            },
            y: {
              beginAtZero: true,
              ticks: { stepSize: 50 },
            },
          },
        }}
      />
    </div>
  );
};

export default MensajesPorMesChart;

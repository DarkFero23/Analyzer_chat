import React from "react";
import { PieChart, Pie, Tooltip, Cell, Legend } from "recharts";

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#A28DFF",
  "#FF6384",
  "#FF4500",
  "#32CD32",
];

const EmojiChart = ({ emojiData }) => {
  console.log("📊 Datos recibidos en EmojiChart:", emojiData);

  if (
    !emojiData ||
    !Array.isArray(emojiData.top_emojis) ||
    emojiData.top_emojis.length === 0
  ) {
    return (
      <p className="text-center text-gray-500">
        No hay datos de emojis disponibles.
      </p>
    );
  }

  const chartData = emojiData.top_emojis
    .map(({ user, emoji, count }) => ({
      name: `${emoji} (${user})`,
      value: count,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 10);

  return (
    <div className="p-6 bg-white rounded-lg shadow-md flex flex-col items-center w-[650px]">
      <h2 className="text-lg font-bold mb-4 text-center">Emojis más usados</h2>
      <PieChart width={630} height={520}>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          outerRadius={180}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name.split(" ")[0]} (${(percent * 100).toFixed(1)}%)`
          }
          labelLine={{ length: 20 }}
        >
          {chartData.map((_, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend
          layout="vertical"
          align="right"
          verticalAlign="middle"
          itemGap={12}
          wrapperStyle={{ right: "-40px", paddingLeft: "30px" }}
        />
      </PieChart>
    </div>
  );
};

export default EmojiChart;

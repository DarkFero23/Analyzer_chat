// EmojiChart.jsx el de emojis más usados
import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Tooltip,
  Cell,
  Legend,
} from "recharts";

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
  if (!emojiData?.top_emojis?.length) {
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
    <div className="emoji-chart-container w-full max-w-xl mx-auto p-6 bg-white rounded-lg shadow-md flex flex-col items-center">
      <h2 className="emoji-chart-title text-lg font-bold mb-4 text-center">
        Emojis más usados
      </h2>
      <ResponsiveContainer width="100%" height={400}>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            cx="50%"
            cy="50%"
            outerRadius="80%"
            label={({ name, percent }) =>
              `${name.split(" ")[0]} (${(percent * 100).toFixed(1)}%)`
            }
            labelLine={{ length: 20 }}
          >
            {chartData.map((_, idx) => (
              <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend
            layout="vertical"
            align="right"
            verticalAlign="middle"
            itemGap={12}
            wrapperStyle={{ paddingLeft: "30px" }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EmojiChart;

import React from "react";

interface Card {
  name: string;
  value: number;
  icon: string;
  color1: string;
  color2: string;
  percent: number;
}

 const cardsData: Card[] = [
  {
    icon: "wallet",
    color1: "#1E3A1E", // dark emerald
    color2: "#6EE7B7", // soft minty green
    name: "Total Balance",
    value: 12345,
    percent: 78,
  },
  {
    icon: "hand-holding-dollar",
    color1: "#065F46", // rich green
    color2: "#10B981", // emerald
    name: "Total Income",
    value: 12345,
    percent: 78,
  },
  {
    icon: "sack-dollar",
    color1: "#047857", // teal-ish green
    color2: "#34D399", // light emerald
    name: "Total Expenses",
    value: 12345,
    percent: 78,
  },
  {
    icon: "piggy-bank",
    color1: "#065F46", // darker green
    color2: "#A7F3D0", // pale mint
    name: "Total Savings",
    value: 12345,
    percent: 78,
  },
];


const SummaryLayer: React.FC = () => {
  

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6">
      {cardsData.map((card, index) => (
        <div
          className="bg-gradient-to-tr rounded-xl transition-all shadow-md hover:shadow-lg shadow-gray-400/45"
          style={{
            backgroundImage: `linear-gradient(to top right, ${card.color1}, ${card.color2}4D)`,
          }}
          key={index}
        >
          <div className="flex flex-col text-white px-4 md:px-6 py-3 md:py-4 md:gap-1">
            <i
              className={`fa-solid fa-${card.icon} text-2xl md:text-3xl text-gray-600/40 p-1`}
            ></i>
            <p className="text-sm font-semibold">{card.name}</p>
            <p className="text-2xl md:text-3xl font-semibold mt-1 mb-2 tracking-wide">
              ₹ {card.value.toLocaleString("en-IN")}.
              <span className="text-xs">
                {card.value.toString().split(".")[1] || "00"}
              </span>
            </p>
            <p className="text-xs text-white/70">
              <span
                className={`text-xs font-extrabold w-fit md:w-full px-2 py-1 mb-1 md:mb-0 md:mx-1 block md:inline bg-white/40 rounded-lg ${
                  card.percent >= 0 ? "text-green-700" : "text-red-700"
                }`}
              >
                {card.percent >= 0 ? "+" : "-"} {Math.abs(card.percent)}%{" "}
                {card.percent >= 0 ? "↗" : "↙"}
              </span>
              than last month
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SummaryLayer;

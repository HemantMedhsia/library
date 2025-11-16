import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
} from "recharts";

const COLORS = ["#10B981", "#34D399", "#6EE7B7", "#A7F3D0", "#DCFCE7"];

export default function PieChartCard({
  data,
  dataKey = "value",
  nameKey = "name",
}: {
  data: any[];
  dataKey?: string;
  nameKey?: string;
}) {
  return (
    <ResponsiveContainer width="100%" height={250}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          outerRadius={90}
          dataKey={dataKey}
          nameKey={nameKey}
          label
        >
          {data.map((_, i) => (
            <Cell key={i} fill={COLORS[i % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
      </PieChart>
    </ResponsiveContainer>
  );
}

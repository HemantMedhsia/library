import React, { useEffect } from "react";
import { motion } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import { TrendingUp, TrendingDown, DollarSign, Users } from "lucide-react";
import Headbar from "../components/dashboard/Headbar";
import SummaryLayer from "../components/common/SummaryLayer";
import api from "../services/api";
import { useToast } from "../hooks/useToast";
import ToastContainer from "../components/common/Toast/ToastContainer";

const COLORS = ["#10B981", "#3B82F6", "#FACC15", "#F472B6", "#A78BFA"];

const Dashboard: React.FC = () => {
  const { toasts, addToast, removeToast, defaultPosition } =
    useToast("bottom-left");

  const helloApiCall = async () => {
    api
      .post("auth/refresh")
      .then((response) => {
        addToast(JSON.stringify(response.data.message));
      })
      .catch((error) => {
        addToast("Error: " + error.message);
      });
  };

  const helloApiCall2 = async () => {
    api
      .get("/hello", { withCredentials: true })
      .then((response) => {
        addToast(JSON.stringify(response.data));
      })
      .catch((error) => {
        addToast("Error: " + error.message);
      });
  };

  // Dummy Data
  const monthlyExpense = [
    { month: "Jan", expense: 4000, income: 6500 },
    { month: "Feb", expense: 5000, income: 7100 },
    { month: "Mar", expense: 4800, income: 7200 },
    { month: "Apr", expense: 5300, income: 7600 },
    { month: "May", expense: 6000, income: 8100 },
    { month: "Jun", expense: 6800, income: 8700 },
    { month: "Jul", expense: 7200, income: 8900 },
  ];

  const categoryBreakdown = [
    { name: "Food", value: 22000 },
    { name: "Transport", value: 8000 },
    { name: "Bills", value: 12000 },
    { name: "Shopping", value: 10000 },
  ];

  const weeklyTrend = [
    { day: "Mon", value: 1200 },
    { day: "Tue", value: 1900 },
    { day: "Wed", value: 1700 },
    { day: "Thu", value: 2400 },
    { day: "Fri", value: 2100 },
    { day: "Sat", value: 2600 },
    { day: "Sun", value: 3000 },
  ];

  const recentTransactions = [
    { id: 1, title: "Netflix Subscription", category: "Entertainment", amount: "₹499", date: "Nov 10" },
    { id: 2, title: "Zomato Order", category: "Food", amount: "₹650", date: "Nov 11" },
    { id: 3, title: "Electricity Bill", category: "Bills", amount: "₹1,200", date: "Nov 09" },
    { id: 4, title: "Amazon Purchase", category: "Shopping", amount: "₹2,999", date: "Nov 08" },
  ];

  return (
    <div className="p-5  min-h-screen">
      <Headbar />
      <SummaryLayer />

      {/* ===================== STATS CARDS ===================== */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-6"
      >
        <StatCard
          icon={<DollarSign size={24} className="text-emerald-600" />}
          title="Total Expense"
          value="₹52,400"
          trend="+12%"
          trendUp
        />
        <StatCard
          icon={<TrendingUp size={24} className="text-blue-600" />}
          title="Monthly Income"
          value="₹82,000"
          trend="+5%"
          trendUp
        />
        <StatCard
          icon={<TrendingDown size={24} className="text-rose-600" />}
          title="Pending Bills"
          value="₹6,200"
          trend="-8%"
        />
        <StatCard
          icon={<Users size={24} className="text-amber-600" />}
          title="Active Users"
          value="143"
          trend="+3%"
          trendUp
        />
      </motion.div>

      {/* ===================== CHARTS ===================== */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
        {/* Bar Chart */}
        <ChartCard title="Monthly Income vs Expense">
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={monthlyExpense}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="income" fill="#10B981" radius={[6, 6, 0, 0]} />
              <Bar dataKey="expense" fill="#3B82F6" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Pie Chart */}
        <ChartCard title="Expense Category Breakdown">
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie
                data={categoryBreakdown}
                dataKey="value"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {categoryBreakdown.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* Line + Area Chart Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Line Chart */}
        <ChartCard title="Weekly Spending Trend">
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={weeklyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="day" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="value"
                stroke="#10B981"
                strokeWidth={2.5}
                dot={{ r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* Area Chart */}
        <ChartCard title="Cumulative Monthly Expenses">
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyExpense}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="expense"
                stroke="#3B82F6"
                fill="#bfdbfe"
                fillOpacity={0.6}
              />
            </AreaChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* ===================== RECENT ACTIVITY TABLE ===================== */}
      <div className="mt-10 bg-white/80 backdrop-blur-md rounded-2xl border border-emerald-100 shadow-md overflow-hidden">
        <div className="p-5 border-b border-emerald-50 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-emerald-700">
            Recent Transactions
          </h3>
          <span className="text-sm text-emerald-500">This Week</span>
        </div>
        <div className="divide-y divide-emerald-50">
          {recentTransactions.map((txn) => (
            <motion.div
              key={txn.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex justify-between items-center p-4 hover:bg-emerald-50 transition-all"
            >
              <div>
                <p className="font-medium text-emerald-800">{txn.title}</p>
                <p className="text-xs text-emerald-500">{txn.category}</p>
              </div>
              <div className="flex items-center gap-6">
                <p className="font-semibold text-emerald-600">{txn.amount}</p>
                <p className="text-sm text-emerald-500">{txn.date}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Buttons to test APIs */}
      <div className="mt-6 flex gap-4">
        <button
          onClick={helloApiCall}
          className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 shadow transition"
        >
          Test Refresh API
        </button>
        <button
          onClick={helloApiCall2}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow transition"
        >
          Test Hello API
        </button>
      </div>

      {/* Toasts */}
      <ToastContainer
        toasts={toasts}
        removeToast={removeToast}
        position={defaultPosition}
      />
    </div>
  );
};

export default Dashboard;

// ===================== SUBCOMPONENTS =====================

function StatCard({
  title,
  value,
  trend,
  trendUp,
  icon,
}: {
  title: string;
  value: string;
  trend: string;
  trendUp?: boolean;
  icon: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 200 }}
      className="p-5 rounded-2xl bg-gradient-to-br from-white/70 to-emerald-50/60 shadow-md border border-emerald-100/50 backdrop-blur-sm flex items-center gap-4"
    >
      <div className="p-3 bg-emerald-50 rounded-full shadow-inner">{icon}</div>
      <div>
        <h4 className="text-sm text-emerald-600 font-medium">{title}</h4>
        <p className="text-2xl font-bold text-emerald-800">{value}</p>
        <span
          className={`text-sm ${
            trendUp ? "text-emerald-600" : "text-rose-600"
          }`}
        >
          {trend}
        </span>
      </div>
    </motion.div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className="bg-white/80 backdrop-blur-md border border-emerald-100 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all"
    >
      <h4 className="text-lg font-semibold text-emerald-700 mb-3">{title}</h4>
      {children}
    </motion.div>
  );
}

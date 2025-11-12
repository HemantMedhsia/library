import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";
import AddExpense from "./pages/expense/AddExpense";
import AddSaving from "./pages/saving/AddSaving";
import Income from "./pages/income/Income";

function App() {
  return (
      <Routes>
        {/* Public route */}
        <Route path="/auth" element={<AuthPage />} />

        {/* Protected routes */}
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          {/* Nested routes inside Layout */}
          <Route index element={<Dashboard />} />
          <Route path="income" element={<Income />} />
          <Route path="expenses/add-expense" element={<AddExpense />} />
          <Route path="expenses/add-saving" element={<AddSaving/>}/>
        </Route>
      </Routes>
  );
}

export default App;

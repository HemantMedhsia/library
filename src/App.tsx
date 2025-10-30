import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import Dashboard from "./pages/Dashboard";
import AuthPage from "./pages/auth/AuthPage";
import ProtectedRoute from "./routes/ProtectedRoute";
import "./App.css";
import AddExpense from "./pages/expense/AddExpense";

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
          <Route path="income" element={<div>hello</div>} />
          <Route path="expenses/add-expense" element={<AddExpense />} />
        </Route>
      </Routes>
  );
}

export default App;

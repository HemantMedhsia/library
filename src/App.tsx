import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout"; // adjust path as needed
import "./App.css";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Routes>
        {/* Layout wrapper */}
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="/income" index element={<div>hello</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;

import { Routes, Route, Link } from "react-router";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <div>
      <nav>
        <Link to="/">Book</Link> | <Link to="/dashboard">Dashboard</Link>
      </nav>

      <Routes>
        <Route path="/" element={<BookingPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
      </Routes>
    </div>
  );
}

export default App;
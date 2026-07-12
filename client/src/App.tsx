import { Routes, Route, NavLink } from "react-router";
import BookingPage from "./pages/BookingPage";
import DashboardPage from "./pages/DashboardPage";

function App() {
  return (
    <>
      <header className="topbar">
        <div className="brand">SlotLine</div>
        <nav className="nav">
          <NavLink to="/" end>Book</NavLink>
          <NavLink to="/dashboard">Dashboard</NavLink>
        </nav>
      </header>
      <main className="container">
        <Routes>
          <Route path="/" element={<BookingPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Routes>
      </main>
    </>
  );
}

export default App;
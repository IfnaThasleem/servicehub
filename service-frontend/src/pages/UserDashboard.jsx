import React from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function UserDashboard() {
  const navigate = useNavigate();
  const role = localStorage.getItem("role");

  return (
    <div style={page}>
      <Navbar role={role} />

      <div style={content}>
        <h2 style={{ marginBottom: "0.5rem" }}>User Dashboard</h2>
        <p style={{ color: "#94a3b8", marginBottom: "2rem" }}>
          Manage your services, orders, payments & profile
        </p>

        <div style={grid}>
          <Card
            icon="🛠"
            title="Browse Services"
            desc="Explore available services"
            onClick={() => navigate("/services")}
          />

          <Card
            icon="📦"
            title="My Orders"
            desc="Track your bookings"
            onClick={() => navigate("/orders")}
          />

          <Card
            icon="💳"
            title="Payments"
            desc="View payment history"
            onClick={() => navigate("/payments")}
          />

          <Card
            icon="⭐"
            title="My Reviews"
            desc="Manage your reviews"
            onClick={() => navigate("/reviews")}
          />

          <Card
            icon="👤"
            title="Profile"
            desc="Edit your profile"
            onClick={() => navigate("/profile")}
            highlight
          />
        </div>
      </div>
    </div>
  );
}

/* ================= CARD ================= */
const Card = ({ icon, title, desc, onClick, highlight }) => (
  <div
    style={{
      ...card,
      background: highlight
        ? "linear-gradient(135deg, #4f7cff, #1e40af)"
        : card.background,
    }}
    onClick={onClick}
  >
    <h3 style={{ fontSize: "1.2rem" }}>
      {icon} {title}
    </h3>
    <p style={{ color: "#cbd5f5", marginTop: "0.5rem", fontSize: "0.9rem" }}>
      {desc}
    </p>
  </div>
);

/* ================= STYLES ================= */
const page = {
  minHeight: "100vh",
  background: "#020617",
  color: "white",
};

const content = {
  padding: "2rem",
};

const grid = {
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(230px, 1fr))",
  gap: "1.5rem",
};

const card = {
  background: "#0f172a",
  padding: "1.8rem",
  borderRadius: "16px",
  cursor: "pointer",
  transition: "transform 0.25s ease, box-shadow 0.25s ease",
  boxShadow: "0 10px 25px rgba(0,0,0,0.3)",
};

import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useLocation } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AdminManagement() {
  const location = useLocation();

  /* ================= STATE ================= */
  const [activeTab, setActiveTab] = useState(
    location.state?.tab || "customers"
  );

  const [customers, setCustomers] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [orders, setOrders] = useState([]);
  const [services, setServices] = useState([]);

  const [loading, setLoading] = useState(true);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [editingService, setEditingService] = useState(null);

  const [newService, setNewService] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
  });

  /* ================= FETCH ALL ================= */
  const fetchAll = useCallback(async () => {
    const token = localStorage.getItem("token");
    const headers = { Authorization: `Bearer ${token}` };

    try {
      const [usersRes, ordersRes, servicesRes] = await Promise.all([
        axios.get("http://localhost:5000/api/users", { headers }),
        axios.get("http://localhost:5000/api/orders", { headers }),
        axios.get("http://localhost:5000/api/services", { headers }),
      ]);

      const users = usersRes.data;
      setCustomers(users.filter((u) => u.role === "user"));
      setVendors(users.filter((u) => u.role === "vendor"));
      setOrders(ordersRes.data);
      setServices(servicesRes.data);
    } catch (err) {
      console.error("Admin fetch error:", err);
      alert(err.response?.data?.message || "Failed to fetch data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  /* ================= VENDOR ================= */
  const toggleVendorStatus = async (vendor) => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${vendor._id}`,
        { isApproved: !vendor.isApproved },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      fetchAll();
    } catch  {
      alert("Failed to update vendor");
    }
  };

  const handleEditVendor = async () => {
    try {
      await axios.put(
        `http://localhost:5000/api/users/${editingVendor._id}`,
        editingVendor,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );
      setModalOpen(false);
      setEditingVendor(null);
      fetchAll();
    } catch {
      alert("Failed to edit vendor");
    }
  };

  const handleDeleteVendor = async (id) => {
    if (!window.confirm("Delete vendor?")) return;
    await axios.delete(`http://localhost:5000/api/users/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchAll();
  };

  /* ================= SERVICES ================= */
  const handleAddService = async () => {
    if (!newService.name || !newService.price) {
      return alert("Fill all fields");
    }

    await axios.post(
      "http://localhost:5000/api/services",
      { ...newService, price: Number(newService.price) },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );

    setNewService({ name: "", description: "", price: "", category: "" });
    fetchAll();
  };

  const handleEditService = async () => {
    await axios.put(
      `http://localhost:5000/api/services/${editingService._id}`,
      editingService,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    setModalOpen(false);
    setEditingService(null);
    fetchAll();
  };

  const handleDeleteService = async (id) => {
    if (!window.confirm("Delete service?")) return;
    await axios.delete(`http://localhost:5000/api/services/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
    });
    fetchAll();
  };

  /* ================= ORDERS ================= */
  const updateOrderStatus = async (id, status) => {
    await axios.put(
      `http://localhost:5000/api/orders/${id}`,
      { status },
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    fetchAll();
  };

  if (loading) return <p style={{ color: "white", padding: "2rem" }}>Loading...</p>;

  return (
    <div style={page}>
      <Navbar role="admin" />

      <h2>Admin Management</h2>

      {/* TABS */}
      <div style={tabs}>
        {["customers", "vendors", "orders", "services"].map((tab) => (
          <button
            key={tab}
            style={activeTab === tab ? activeTabBtn : tabBtn}
            onClick={() => setActiveTab(tab)}
          >
            {tab.toUpperCase()}
          </button>
        ))}
      </div>

      {/* CUSTOMERS */}
      {activeTab === "customers" &&
        customers.map((c) => (
          <div key={c._id} style={card}>
            <b>{c.name}</b>
            <p>{c.email}</p>
          </div>
        ))}

      {/* VENDORS */}
      {activeTab === "vendors" &&
        vendors.map((v) => (
          <div key={v._id} style={card}>
            <b>{v.name}</b>
            <p>{v.email}</p>
            <p>Status: {v.isApproved ? "✅ Approved" : "⛔ Suspended"}</p>

            <button style={btn} onClick={() => toggleVendorStatus(v)}>
              {v.isApproved ? "Suspend" : "Approve"}
            </button>
            <button
              style={btn}
              onClick={() => {
                setEditingVendor(v);
                setModalOpen(true);
              }}
            >
              Edit
            </button>
            <button style={deleteBtn} onClick={() => handleDeleteVendor(v._id)}>
              Delete
            </button>
          </div>
        ))}

      {/* ORDERS */}
      {activeTab === "orders" &&
        orders.map((o) => (
          <div key={o._id} style={card}>
            <b>{o.serviceName}</b>
            <select
              value={o.status}
              onChange={(e) => updateOrderStatus(o._id, e.target.value)}
            >
              <option value="pending">Pending</option>
              <option value="inProgress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
        ))}

      {/* SERVICES */}
      {activeTab === "services" && (
        <>
          <input
            style={input}
            placeholder="Service name"
            value={newService.name}
            onChange={(e) =>
              setNewService({ ...newService, name: e.target.value })
            }
          />
          <input
            style={input}
            placeholder="Price"
            type="number"
            value={newService.price}
            onChange={(e) =>
              setNewService({ ...newService, price: e.target.value })
            }
          />
          <button style={btn} onClick={handleAddService}>
            Add Service
          </button>

          {services.map((s) => (
            <div key={s._id} style={card}>
              <b>{s.name}</b>
              <p>Rs {s.price}</p>
              <button
                style={btn}
                onClick={() => {
                  setEditingService(s);
                  setModalOpen(true);
                }}
              >
                Edit
              </button>
              <button
                style={deleteBtn}
                onClick={() => handleDeleteService(s._id)}
              >
                Delete
              </button>
            </div>
          ))}
        </>
      )}

      {/* MODAL */}
      {modalOpen && (
        <div style={modalOverlay}>
          <div style={modal}>
            {editingVendor && (
              <>
                <h3>Edit Vendor</h3>
                <input
                  style={input}
                  value={editingVendor.name}
                  onChange={(e) =>
                    setEditingVendor({
                      ...editingVendor,
                      name: e.target.value,
                    })
                  }
                />
                <button style={btn} onClick={handleEditVendor}>
                  Save
                </button>
              </>
            )}

            {editingService && (
              <>
                <h3>Edit Service</h3>
                <input
                  style={input}
                  value={editingService.name}
                  onChange={(e) =>
                    setEditingService({
                      ...editingService,
                      name: e.target.value,
                    })
                  }
                />
                <button style={btn} onClick={handleEditService}>
                  Save
                </button>
              </>
            )}

            <button style={btn} onClick={() => setModalOpen(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ================= STYLES ================= */
const page = { background: "#020617", minHeight: "100vh", padding: "2rem", color: "white" };
const tabs = { display: "flex", gap: "1rem", marginBottom: "1rem" };
const tabBtn = { background: "#1e293b", padding: "8px 14px", border: "none", color: "white" };
const activeTabBtn = { ...tabBtn, background: "#4f7cff" };
const card = { background: "#0f172a", padding: "1rem", borderRadius: "10px", marginBottom: "1rem" };
const btn = { background: "#4f7cff", padding: "6px 10px", border: "none", color: "white", marginRight: "6px" };
const deleteBtn = { ...btn, background: "#ef4444" };
const input = { width: "100%", marginBottom: "8px", padding: "8px", background: "#1e293b", border: "1px solid #334155", color: "white" };
const modalOverlay = { position: "fixed", inset: 0, background: "rgba(0,0,0,0.6)", display: "flex", justifyContent: "center", alignItems: "center" };
const modal = { background: "#0f172a", padding: "2rem", borderRadius: "12px", width: "350px" };

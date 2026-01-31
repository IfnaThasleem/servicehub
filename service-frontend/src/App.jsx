import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

/* ===== PUBLIC ===== */
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";

/* ===== ADMIN ===== */
import AdminDashboard from "./pages/AdminDashboard";
import AdminManagement from "./pages/AdminManagement";

/* ===== VENDOR ===== */
import VendorDashboard from "./pages/VendorDashboard";
import VendorServices from "./pages/VendorServices";
import VendorEarnings from "./pages/VendorEarnings";

/* ===== USER ===== */
import UserDashboard from "./pages/UserDashboard";

/* ===== SHARED ===== */
import OrdersPage from "./pages/OrdersPage";
import ServicesPage from "./pages/ServicesPage";
import PaymentPage from "./pages/PaymentPage";
import ReviewsPage from "./pages/ReviewsPage";
import ProfilePage from "./pages/ProfilePage";

/* ===== AUTH ===== */
import ProtectedRoute from "./components/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ========= PUBLIC ========= */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        {/* ========= ADMIN ========= */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/manage"
          element={
            <ProtectedRoute role="admin">
              <AdminManagement />
            </ProtectedRoute>
          }
        />

        {/* ========= VENDOR ========= */}
        <Route
          path="/vendor/dashboard"
          element={
            <ProtectedRoute role="vendor">
              <VendorDashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/services"
          element={
            <ProtectedRoute role="vendor">
              <VendorServices />
            </ProtectedRoute>
          }
        />
        <Route
          path="/vendor/earnings"
          element={
            <ProtectedRoute role="vendor">
              <VendorEarnings />
            </ProtectedRoute>
          }
        />

        {/* ========= USER ========= */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedRoute role="user">
              <UserDashboard />
            </ProtectedRoute>
          }
        />

        {/* ========= SHARED ========= */}
        <Route
          path="/services"
          element={
            <ProtectedRoute>
              <ServicesPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/orders"
          element={
            <ProtectedRoute>
              <OrdersPage />
            </ProtectedRoute>
          }
        />

        {/* ========= PAYMENTS ========= */}
        <Route
          path="/payments"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/payment/:orderId"
          element={
            <ProtectedRoute>
              <PaymentPage />
            </ProtectedRoute>
          }
        />

        {/* ========= REVIEWS ========= */}
        <Route
          path="/reviews"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />

        <Route
          path="/reviews/:serviceId"
          element={
            <ProtectedRoute>
              <ReviewsPage />
            </ProtectedRoute>
          }
        />

        {/* ========= PROFILE ========= */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        />

        {/* ========= FALLBACK ========= */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

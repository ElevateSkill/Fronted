import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import MainView from "./pages/MainView";
import About from "./pages/About";

// auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";

// scroll to top on route change
import ScrollToTop from "./components/ScrollToTop";

function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 rounded-full border-2 border-[#15c8fb]/30 border-t-[#15c8fb] animate-spin" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role?.toLowerCase() !== role.toLowerCase()) {
    return <Navigate to={user.role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

function PublicRoute({ children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black">
        <div className="w-8 h-8 rounded-full border-2 border-[#15c8fb]/30 border-t-[#15c8fb] animate-spin" />
      </div>
    );
  }
  if (user) {
    return <Navigate to={user.role?.toLowerCase() === 'admin' ? '/admin' : '/dashboard'} replace />;
  }
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute role="student"><UserDashboard /></ProtectedRoute>} />

          <Route path="/" element={<Layout />}>
            <Route index element={<MainView />} />
          </Route>
          <Route path="/about" element={<About />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
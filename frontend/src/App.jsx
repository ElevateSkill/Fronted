import React, { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import MainView from "./pages/MainView";
import About from "./pages/About";

import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import Partners from "./pages/Partners";

import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";

import ScrollToTop from "./components/ScrollToTop";
import ProtectedRoute from "./components/ProtectedRoute";
import { AuthProvider } from "./context/AuthContext";

export default function App() {
  useEffect(() => {
    localStorage.removeItem('elevate_data');
  }, []);

  return (
    <BrowserRouter>
      <AuthProvider>
        <ScrollToTop />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute requiredRole="admin"><AdminDashboard /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute requiredRole="student"><UserDashboard /></ProtectedRoute>} />
          <Route path="/" element={<Layout />}>
            <Route index element={<MainView />} />
            <Route path="about" element={<About />} />
            <Route path="partners" element={<Partners />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
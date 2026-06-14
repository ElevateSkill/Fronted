import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import Layout from "./components/Layout";
import MainView from "./pages/MainView";
import About from "./pages/About";
import PublicAnnouncements from "./pages/PublicAnnouncements";

// auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";

// dashboards
import AdminLayout from "./pages/admin/AdminLayout";
import OverviewSection from "./pages/admin/sections/OverviewSection";
import CoursesSection from "./pages/admin/sections/CoursesSection";
import CategoriesSection from "./pages/admin/sections/CategoriesSection";
import PaymentsSection from "./pages/admin/sections/PaymentsSection";
import AnnouncementsSection from "./pages/admin/sections/AnnouncementsSection";
import CmsSection from "./pages/admin/sections/CmsSection";
import HeroContentSection from "./pages/admin/sections/cms/HeroContentSection";
import AboutSection from "./pages/admin/sections/cms/AboutSection";
import SettingsSection from "./pages/admin/sections/cms/SettingsSection";
import TestimonialsSection from "./pages/admin/sections/cms/TestimonialsSection";
import FaqsSection from "./pages/admin/sections/cms/FaqsSection";
import SectionsVisibility from "./pages/admin/sections/cms/SectionsVisibility";
import ExportSection from "./pages/admin/sections/ExportSection";
import ProfileSection from "./pages/admin/sections/ProfileSection";
import UsersSection from "./pages/admin/sections/UsersSection";
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
          <Route path="/dashboard" element={<ProtectedRoute role="student"><UserDashboard /></ProtectedRoute>} />

          {/* Admin with nested routes for each CMS section */}
          <Route path="/admin" element={<ProtectedRoute role="admin"><AdminLayout /></ProtectedRoute>}>
            <Route index element={<OverviewSection />} />
            <Route path="courses" element={<CoursesSection />} />
            <Route path="categories" element={<CategoriesSection />} />
            <Route path="payments" element={<PaymentsSection />} />
            <Route path="announcements" element={<AnnouncementsSection />} />
            <Route path="cms" element={<CmsSection />} />
            <Route path="cms/hero" element={<HeroContentSection />} />
            <Route path="cms/about" element={<AboutSection />} />
            <Route path="cms/settings" element={<SettingsSection />} />
            <Route path="cms/testimonials" element={<TestimonialsSection />} />
            <Route path="cms/faqs" element={<FaqsSection />} />
            <Route path="cms/visibility" element={<SectionsVisibility />} />
            <Route path="export" element={<ExportSection />} />
            <Route path="profile" element={<ProfileSection />} />
            <Route path="users" element={<UsersSection />} />
          </Route>

          <Route path="/" element={<Layout />}>
            <Route index element={<MainView />} />
            <Route path="about" element={<About />} />
            <Route path="announcements" element={<PublicAnnouncements />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

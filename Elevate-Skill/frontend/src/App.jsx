import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";
import Layout from "./components/Layout";
import MainView from "./pages/MainView"; // The multi-section page
import About from "./pages/About";


// auth
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


// dashboards
import AdminDashboard from "./pages/admin/AdminDashboard";
import UserDashboard from "./pages/user/UserDashboard";

// scroll to top on route change
import ScrollToTop from "./components/ScrollToTop";

export default function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <BrowserRouter>
      <ScrollToTop />
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/dashboard" element={<UserDashboard />} />

          {/* Everything inside here shares the Navbar and Footer */}
          <Route path="/" element={<Layout isDark={isDark} setIsDark={setIsDark} />}>
            
            {/* This renders the Landing + Services + Stories + FAQ together */}
            <Route index element={<MainView />} />
            
            {/* This renders JUST the About page */}
            
          </Route>
          <Route path="/about" element={<About />} />

        </Routes>

    </BrowserRouter>
  );
}
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useState } from "react";

// Layout
import Layout from "./components/Layout";

// Pages
import Landing from "./pages/Landing";
import Services from "./pages/Service";
import Stories from "./pages/Stories";
import FAQ from "./pages/FAQ";
import Contact from "./pages/Contact";

export default function App() {
  const [isDark, setIsDark] = useState(true);

  return (
    <BrowserRouter>
      <Routes>
        {/* The Layout wraps all these routes */}
        <Route path="/" element={<Layout isDark={isDark} setIsDark={setIsDark} />}>
          
          {/* Default page (Home) */}
          <Route index element={<Landing />} />
          
          {/* Other pages */}
          <Route path="services" element={<Services />} />
          <Route path="stories" element={<Stories />} />
          <Route path="faq" element={<FAQ />} />
          <Route path="contact" element={<Contact />} />
          
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
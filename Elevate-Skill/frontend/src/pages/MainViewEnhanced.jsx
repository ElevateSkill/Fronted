import { useState, useEffect } from "react";
import { useHomepageData, useAnnouncements, useLatestNews } from "../hooks/useHomepageData";
import Landing from "./Landing";
import Services from "./Service";
import Testimonals from "./Testimonals";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Courses from "./Courses";
import Blog from "./Blog";
import LatestNewsSection from "../components/LatestNewsSection";
import HomeAboutSection from "../components/HomeAboutSection";
import LoadingSpinner from "../components/LoadingSpinner";

const VISIBILITY_KEY = 'elevateskill_section_visibility';

function isSectionVisible(section) {
  try {
    const raw = localStorage.getItem(VISIBILITY_KEY);
    if (raw) {
      const vis = JSON.parse(raw);
      return vis[section] !== false;
    }
  } catch {}
  return true;
}

/**
 * Enhanced MainView with custom hooks for better code organization
 * This is an alternative to the original MainView.jsx
 * 
 * Benefits:
 * - Cleaner component code
 * - Reusable data fetching logic
 * - Better error handling
 * - Loading states
 * - Offline caching
 * 
 * To use: Replace MainView in Routes.jsx with MainViewEnhanced
 */
export default function MainViewEnhanced() {
  const { data: liveHomepage, loading: homepageLoading } = useHomepageData();
  const { announcements } = useAnnouncements();
  const { news: latestNews } = useLatestNews();
  const [visibility, setVisibility] = useState({ about: true, contact: true });

  useEffect(() => {
    setVisibility({
      about: isSectionVisible('about'),
      contact: isSectionVisible('contact'),
    });
    const handleStorage = () => {
      setVisibility({
        about: isSectionVisible('about'),
        contact: isSectionVisible('contact'),
      });
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <>
      <section id="home">
        <Landing heroData={liveHomepage?.hero} />
      </section>
      
      <LatestNewsSection items={latestNews} />
      
      <section id="services">
        <Services />
      </section>
      
      <section id="courses">
        <Courses />
      </section>
      
      <Testimonals testimonials={liveHomepage?.testimonials} />
      
      <FAQ faqs={liveHomepage?.faqs || []} />
      
      <section id="blog">
        <Blog />
      </section>

      {visibility.about && <HomeAboutSection aboutData={liveHomepage?.about} />}
      
      {visibility.contact && (
        <section id="contact">
          <Contact />
        </section>
      )}
    </>
  );
}

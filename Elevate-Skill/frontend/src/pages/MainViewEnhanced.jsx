import { useHomepageData, useAnnouncements, useLatestNews } from "../hooks/useHomepageData";
import Landing from "./Landing";
import Services from "./Service";
import Testimonals from "./Testimonals";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Courses from "./Courses";
import Blog from "./Blog";
import LatestNewsSection from "../components/LatestNewsSection";
import LoadingSpinner from "../components/LoadingSpinner";

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

  // Optional: Show loading spinner while fetching initial data
  // Comment out if you prefer to show static content immediately
  /*
  if (homepageLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <LoadingSpinner message="Loading homepage..." />
      </div>
    );
  }
  */

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
      
      <section id="contact">
        <Contact />
      </section>
    </>
  );
}

import { useState, useEffect } from "react";
import { api, unwrapResults } from "../services/api";
import Landing from "./Landing";
import Services from "./Service";
import Testimonals from "./Testimonals";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Courses from "./Courses";
import Blog from "./Blog";
import LatestNewsSection from "../components/LatestNewsSection";
import HomeAboutSection from "../components/HomeAboutSection";

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

export default function MainView() {
  const [liveHomepage, setLiveHomepage] = useState(null);
  const [latestNews, setLatestNews] = useState([]);
  const [visibility, setVisibility] = useState({ about: true, contact: true });

  useEffect(() => {
    const fetchAndCacheAnnouncements = async () => {
      try {
        const token = localStorage.getItem('access_token');
        let data = [];
        if (token) {
          try {
            const res = await api.get('/announcements/');
            data = unwrapResults(res.data);
          } catch {
            const res = await api.get('/admin/announcements/');
            data = unwrapResults(res.data).filter(a => a.is_published);
          }
        } else {
          const res = await api.get('/announcements/');
          data = unwrapResults(res.data);
        }

        if (data && data.length > 0) {
          localStorage.setItem('elevateskill_public_announcements', JSON.stringify(data));
          window.dispatchEvent(new Event('announcements-updated'));
        }
      } catch (err) {
        console.error("Announcements fetch error:", err);
      }
    };
    const fetchLatestNews = async () => {
      try {
        const res = await api.get('/news/');
        const data = unwrapResults(res.data)
          .filter((item) => item.status === 'published')
          .sort((a, b) => new Date(b.created_at || 0) - new Date(a.created_at || 0));
        setLatestNews(data);
      } catch (err) {
        console.error('News fetch error:', err);
      }
    };

    fetchAndCacheAnnouncements();
    fetchLatestNews();

    api.get('/homepage/')
      .then(res => setLiveHomepage(res.data))
      .catch(() => {});

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
      <section id="home"><Landing heroData={liveHomepage?.hero} /></section>
      <LatestNewsSection items={latestNews} />
      <section id="services"><Services /></section>
      <section id="courses"><Courses /></section>
      <Testimonals testimonials={liveHomepage?.testimonials} />
      <FAQ faqs={liveHomepage?.faqs || []} />
      <section id="blog"><Blog /></section>
      {visibility.about && <HomeAboutSection aboutData={liveHomepage?.about} />}
      {visibility.contact && <section id="contact"><Contact /></section>}
    </>
  );
}
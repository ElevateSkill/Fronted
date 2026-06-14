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
  const [visibility, setVisibility] = useState({
    hero: true, news: true, services: true, courses: true,
    testimonials: true, faq: true, blog: true, about: true, contact: true,
  });

  const loadVisibility = () => ({
    hero: isSectionVisible('hero'),
    news: isSectionVisible('news'),
    services: isSectionVisible('services'),
    courses: isSectionVisible('courses'),
    testimonials: isSectionVisible('testimonials'),
    faq: isSectionVisible('faq'),
    blog: isSectionVisible('blog'),
    about: isSectionVisible('about'),
    contact: isSectionVisible('contact'),
  });

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
          const res = await api.get('/news/');
          data = unwrapResults(res.data).filter(n => n.status === 'published' || n.is_published !== false);
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

    setVisibility(loadVisibility());

    const handleStorage = () => {
      setVisibility(loadVisibility());
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return (
    <>
      {visibility.hero && <section id="home"><Landing heroData={liveHomepage?.hero} /></section>}
      {visibility.news && <LatestNewsSection items={latestNews} />}
      {visibility.services && <section id="services"><Services /></section>}
      {visibility.courses && <section id="courses"><Courses /></section>}
      {visibility.testimonials && <Testimonals testimonials={liveHomepage?.testimonials} />}
      {visibility.faq && <FAQ faqs={liveHomepage?.faqs || []} />}
      {visibility.blog && <section id="blog"><Blog /></section>}
      {visibility.about && <HomeAboutSection aboutData={liveHomepage?.about} />}
      {visibility.contact && <section id="contact"><Contact /></section>}
    </>
  );
}
import { useState, useEffect } from "react";
import { api, unwrapResults } from "../services/api";
import Landing from "./Landing";
import Services from "./Service";
import Testimonals from "./Testimonals";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Courses from "./Courses";
import Blog from "./Blog";

export default function MainView() {
  const [liveHomepage, setLiveHomepage] = useState(null);

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

    fetchAndCacheAnnouncements();

    api.get('/homepage/')
      .then(res => setLiveHomepage(res.data))
      .catch(() => {});
  }, []);

  return (
    <>
      <section id="home"><Landing heroData={liveHomepage?.hero} /></section>
      <section id="services"><Services /></section>
      <section id="courses"><Courses /></section>
      <Testimonals testimonials={liveHomepage?.testimonials} />
      <FAQ faqs={liveHomepage?.faqs || []} />
      <section id="blog"><Blog /></section>
      <section id="contact"><Contact /></section>
    </>
  );
}
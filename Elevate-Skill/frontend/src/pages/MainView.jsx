import { useState, useEffect } from "react";
import { Megaphone } from "lucide-react";
import { api, unwrapResults } from "../services/api";
import Landing from "./Landing";
import Services from "./Service";
import Testimonals from "./Testimonals";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Courses from "./Courses";
import Blog from "./Blog";

export default function MainView() {
  const [announcements, setAnnouncements] = useState([]);
  const [liveHomepage, setLiveHomepage] = useState(null);

  useEffect(() => {
    api.get('/announcements/')
      .then(res => {
        const data = unwrapResults(res.data);
        if (data.length > 0) setAnnouncements(data);
      })
      .catch(() => {
        const token = localStorage.getItem('access_token');
        if (token) {
          api.get('/admin/announcements/')
            .then(res => {
              const data = unwrapResults(res.data);
              if (data.length > 0) setAnnouncements(data.filter(a => a.is_published));
            })
            .catch(() => {});
        }
      });

    api.get('/homepage/')
      .then(res => setLiveHomepage(res.data))
      .catch(() => {});
  }, []);

  const items = announcements.length > 0 ? announcements : [];

  return (
    <>
      {items.length > 0 && (
        <div className="relative z-50 bg-gradient-to-r from-[#0f172a] via-[#1e293b] to-[#0f172a] border-b border-white/5 overflow-hidden shadow-2xl">
          <div className="flex items-center gap-3 max-w-7xl mx-auto px-4 sm:px-6">
            <div className="hidden sm:flex items-center gap-2 shrink-0 bg-gradient-to-r from-[#15c8fb] to-[#f89f29] text-white px-3.5 py-2 text-[10px] font-black uppercase tracking-widest shadow-lg">
              <Megaphone size={13} /> Latest
            </div>
            <div className="flex-1 overflow-hidden py-2.5">
              <div className="animate-announcement flex whitespace-nowrap">
                {[...items, ...items].map((a, i) => (
                  <span key={i} className="inline-flex items-center gap-3 mx-6 text-white/80 text-xs font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-gradient-to-r from-[#15c8fb] to-[#f89f29] shrink-0" />
                    <span className="font-bold text-white/95">{a.title}:</span>
                    <span className="text-white/70">{a.content || a.body}</span>
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <section id="home"><Landing heroData={liveHomepage?.hero} /></section>
      <section id="services"><Services /></section>
      <section id="courses"><Courses /></section>
      <Testimonals testimonials={liveHomepage?.testimonials} />
      {liveHomepage?.faqs && liveHomepage.faqs.length > 0 && <FAQ faqs={liveHomepage.faqs} />}
      <section id="blog"><Blog /></section>
      <section id="contact"><Contact /></section>
      <style>{`
        @keyframes announcement-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-announcement {
          animation: announcement-scroll 40s linear infinite;
        }
        .animate-announcement:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
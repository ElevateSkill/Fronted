import Landing from "./Landing";
import Services from "./Service";
import FAQ from "./FAQ";
import Contact from "./Contact";
import Courses from "./Courses";
import Blog from "./Blog";
import { loadData } from "../data/dataStore";

const announcements = loadData('announcements');

export default function MainView() {
  return (
    <>
      {announcements.length > 0 && (
        <div className="relative z-50 bg-gradient-to-r from-[#f89f29] via-[#15c8fb] to-[#f89f29] overflow-hidden">
          <div className="animate-announcement flex whitespace-nowrap py-2.5">
            {[...announcements, ...announcements].map((a, i) => (
              <span key={i} className="inline-flex items-center gap-6 mx-8 text-white font-bold text-xs uppercase tracking-wider">
                <span className="w-1.5 h-1.5 rounded-full bg-white/80" />
                {a.title}: {a.body}
              </span>
            ))}
          </div>
        </div>
      )}
      <section id="home"><Landing /></section>
      <section id="services"><Services /></section>
      <section id="courses"><Courses /></section>
      <section id="blog"><Blog /></section>
      <section id="faq"><FAQ /></section>
      <section id="contact"><Contact /></section>
      <style>{`
        @keyframes announcement-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-announcement {
          animation: announcement-scroll 30s linear infinite;
        }
        .animate-announcement:hover {
          animation-play-state: paused;
        }
      `}</style>
    </>
  );
}
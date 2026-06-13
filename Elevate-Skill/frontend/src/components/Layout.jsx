import { useCallback, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import AnnouncementBar from './AnnouncementBar';

export default function Layout() {
  const [hasAnnouncements, setHasAnnouncements] = useState(false);
  const handleAnnouncements = useCallback((exists) => setHasAnnouncements(exists), []);

  return (
    <div className="min-h-screen flex flex-col">
      <AnnouncementBar onAnnouncements={handleAnnouncements} />
      <Navbar hasAnnouncements={hasAnnouncements} />

      <main className={`grow transition-all duration-500 ${hasAnnouncements ? 'pt-[136px]' : 'pt-24'}`}>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}
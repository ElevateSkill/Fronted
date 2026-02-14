import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout({ isDark, setIsDark }) {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Shared Navbar */}
      <Navbar isDark={isDark} setIsDark={setIsDark} />
      
      {/* Page Content */}
      <main className="grow">
        <Outlet /> 
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
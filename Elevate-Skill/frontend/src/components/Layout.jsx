import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      {/* Page Content */}
      <main className="grow">
        <Outlet /> 
      </main>

      {/* Shared Footer */}
      <Footer />
    </div>
  );
}
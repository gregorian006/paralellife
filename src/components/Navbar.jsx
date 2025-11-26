// src/components/Navbar.jsx
import { useState } from 'react';
import { Link } from 'react-router-dom'; // Kita pakai Link biar SPA (Single Page Application)
import { Menu, X } from 'lucide-react'; // Icon untuk mobile menu

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);

  // Daftar menu navigasi
  const navLinks = [
    { name: 'Beranda', path: '/' },
    { name: 'Fitur AI', path: '#features' }, // Nanti bisa diganti ke page lain
    { name: 'Curhat', path: '/chat' },       // Persiapan untuk fitur chat nanti
    { name: 'Tentang', path: '/about' },
  ];

  return (
  
    <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-[#0a0414]/70 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* --- LOGO SECTION --- */}
          <div className="flex-shrink-0 flex items-center gap-3 cursor-pointer">
            {/* Logo Image */}
            <img 
              className="h-25 w-auto object-contain" 
              src="/images/logo.png" 
              alt="Paralel Life Logo"
            />
          </div>

          {/* --- DESKTOP MENU --- */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className="text-gray-300 hover:text-white hover:scale-105 px-3 py-2 rounded-md text-sm font-medium transition-all duration-300"
                >
                  {link.name}
                </Link>
              ))}
              {/* Tombol Login/Register Khusus */}
              <button className="bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-2 rounded-full font-medium hover:shadow-lg hover:shadow-purple-500/30 transition-all duration-300 text-sm">
                Log in Sekarang
              </button>
            </div>
          </div>

          {/* --- MOBILE MENU BUTTON (Hamburger) --- */}
          <div className="-mr-2 flex md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-white/10 focus:outline-none"
            >
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* --- MOBILE MENU (Dropdown) --- */}
      {isOpen && (
        <div className="md:hidden backdrop-blur-xl bg-[#0a0414]/95 border-b border-white/10">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-300 hover:text-white block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
             <button className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-5 py-3 rounded-lg font-medium">
                Mulai Sekarang
              </button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
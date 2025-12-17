// src/components/Navbar.jsx
import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Sparkles, MessageCircleHeart, Mail, BarChart3 } from 'lucide-react';

const Navbar = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/', icon: null },
    { name: 'Ramal', path: '/chat?mode=ramal', icon: <Sparkles size={16} /> },
    { name: 'Curhat', path: '/chat?mode=curhat', icon: <MessageCircleHeart size={16} /> },
    { name: 'Dashboard', path: '/dashboard', icon: <BarChart3 size={16} /> },
    { name: 'Time Capsule', path: '/time-capsule', icon: <Mail size={16} /> },
  ];

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Get user data when logged in
  useEffect(() => {
    if (isLoggedIn) {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      const firstName = userData.name ? userData.name.split(" ")[0] : "User";
      setUserName(firstName);
      setUserAvatar(userData.avatar_url || "");
    }
  }, [isLoggedIn]);

  // Listen for storage changes (when avatar is updated from profile page)
  useEffect(() => {
    const handleStorageChange = () => {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUserAvatar(userData.avatar_url || "");
      const firstName = userData.name ? userData.name.split(" ")[0] : "User";
      setUserName(firstName);
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom event for same-tab updates
    window.addEventListener('userUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userUpdated', handleStorageChange);
    };
  }, []);

  const handleAuthClick = () => {
    if (isLoggedIn) {
      navigate('/profile');
    } else {
      navigate('/login');
    }
  };

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname + location.search === path;
  };

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${
      scrolled 
        ? 'bg-[#0a0a0f]/90 backdrop-blur-xl border-b border-white/10 shadow-lg shadow-black/20' 
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 md:h-20">
          
          {/* LOGO */}
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={() => navigate('/')}
          >
            <img 
              className="h-10 w-auto object-contain group-hover:scale-105 transition-transform" 
              src="/images/logo.png" 
              alt="Paralel Life" 
            />
          </div>

          {/* DESKTOP MENU */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link 
                key={link.name} 
                to={link.path} 
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium transition-all duration-300
                  ${isActive(link.path) 
                    ? 'bg-white/10 text-white' 
                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
              >
                {link.icon}
                {link.name}
              </Link>
            ))}
          </div>

          {/* AUTH BUTTON */}
          <div className="hidden md:block">
            <button 
              onClick={handleAuthClick} 
              className={`px-5 py-2.5 rounded-full font-medium transition-all duration-300 text-sm flex items-center gap-2
                ${isLoggedIn 
                  ? "bg-white/5 border border-white/20 text-white hover:bg-white/10 hover:border-white/30" 
                  : "bg-gradient-to-r from-purple-600 to-pink-600 text-white hover:shadow-lg hover:shadow-purple-500/25 hover:scale-105"
                }`}
            >
              {isLoggedIn ? (
                <>
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName}
                      className="w-6 h-6 rounded-full object-cover"
                      onError={(e) => {
                        e.target.style.display = 'none';
                        e.target.nextSibling.style.display = 'flex';
                      }}
                    />
                  ) : null}
                  <div 
                    className={`w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 items-center justify-center ${userAvatar ? 'hidden' : 'flex'}`}
                  >
                    <User size={14} />
                  </div>
                  {userName}
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button 
            onClick={() => setIsOpen(!isOpen)} 
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 px-4 py-4 space-y-2">
          {navLinks.map((link) => (
            <Link 
              key={link.name} 
              to={link.path} 
              onClick={() => setIsOpen(false)}
              className={`flex items-center gap-2 px-4 py-3 rounded-xl text-base font-medium transition-colors
                ${isActive(link.path) 
                  ? 'bg-white/10 text-white' 
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
                }`}
            >
              {link.icon}
              {link.name}
            </Link>
          ))}
          
          <div className="pt-2 border-t border-white/10 mt-2">
            <button 
              onClick={() => { setIsOpen(false); handleAuthClick(); }}
              className={`w-full py-3 rounded-xl font-medium transition-colors flex items-center justify-center gap-2
                ${isLoggedIn 
                  ? 'bg-white/5 text-white' 
                  : 'bg-gradient-to-r from-purple-600 to-pink-600 text-white'
                }`}
            >
              {isLoggedIn ? (
                <>
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt={userName}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                  ) : (
                    <User size={18} />
                  )}
                  Profil {userName}
                </>
              ) : (
                "Masuk"
              )}
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
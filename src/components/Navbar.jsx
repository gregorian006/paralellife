// src/components/Navbar.jsx
import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Menu, X, User, Sparkles, MessageCircleHeart, Mail, Bell, BarChart3 } from 'lucide-react';
import { timeCapsuleAPI } from '../services/api';

const Navbar = ({ isLoggedIn }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const notificationRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const navLinks = [
    { name: 'Beranda', path: '/', icon: null },
    { name: 'Ramal', path: '/chat?mode=ramal', icon: <Sparkles size={16} /> },
    { name: 'Curhat', path: '/chat?mode=curhat', icon: <MessageCircleHeart size={16} /> },
    { name: 'Decision Maker', path: '/decision-maker', icon: <BarChart3 size={16} /> },
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

  // Fetch notifications when logged in
  useEffect(() => {
    if (isLoggedIn) {
      fetchNotifications();
      // Poll notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [isLoggedIn]);

  // Close notification dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationRef.current && !notificationRef.current.contains(event.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await timeCapsuleAPI.getNotifications();
      if (response.status === 'success') {
        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
      }
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };

  const markAllAsRead = async () => {
    if (unreadCount === 0) return;
    
    try {
      await timeCapsuleAPI.markAllNotificationsRead();
      // Update state langsung tanpa refetch
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleNotificationDropdownOpen = () => {
    const newState = !showNotifications;
    setShowNotifications(newState);
    
    // Jika dropdown dibuka dan ada notif belum dibaca, mark all as read
    if (newState && unreadCount > 0) {
      markAllAsRead();
    }
  };

  const handleNotificationClick = async (notification) => {
    // Navigate to link if exists
    if (notification.link) {
      navigate(notification.link);
      setShowNotifications(false);
    }
  };

  const formatNotificationTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return 'Baru saja';
    if (minutes < 60) return `${minutes} menit lalu`;
    if (hours < 24) return `${hours} jam lalu`;
    if (days < 7) return `${days} hari lalu`;
    return date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
  };

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
              className="h-12 w-auto object-contain group-hover:scale-105 transition-transform" 
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

          {/* NOTIFICATION & AUTH BUTTONS */}
          <div className="hidden md:flex items-center gap-3">
            {/* Notification Bell - only show when logged in */}
            {isLoggedIn && (
              <div className="relative" ref={notificationRef}>
                <button
                  onClick={handleNotificationDropdownOpen}
                  className="relative p-2.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-all duration-300"
                >
                  <Bell size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full flex items-center justify-center text-xs font-bold text-white animate-pulse">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-[#0a0a0f]/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl shadow-black/50">
                    <div className="sticky top-0 bg-[#0a0a0f] border-b border-white/10 px-4 py-3">
                      <h3 className="text-white font-semibold text-sm">Notifikasi</h3>
                    </div>
                    
                    {notifications.length === 0 ? (
                      <div className="px-4 py-8 text-center">
                        <Bell size={32} className="mx-auto text-gray-600 mb-2" />
                        <p className="text-gray-400 text-sm">Belum ada notifikasi</p>
                      </div>
                    ) : (
                      <div className="py-2">
                        {notifications.map((notif) => (
                          <button
                            key={notif.id}
                            onClick={() => handleNotificationClick(notif)}
                            className="w-full px-4 py-3 text-left hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                          >
                            <div className="flex items-start gap-3">
                              <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600" />
                              <div className="flex-1 min-w-0">
                                <p className="text-white text-sm font-medium mb-1">
                                  {notif.title}
                                </p>
                                <p className="text-gray-400 text-xs mb-1 line-clamp-2">
                                  {notif.message}
                                </p>
                                <p className="text-gray-500 text-xs">
                                  {formatNotificationTime(notif.created_at)}
                                </p>
                              </div>
                            </div>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* AUTH BUTTON */}
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
            onClick={() => {
              const newState = !isOpen;
              setIsOpen(newState);
              // Mark all as read saat mobile menu dibuka (jika ada notif)
              if (newState && isLoggedIn && unreadCount > 0) {
                markAllAsRead();
              }
            }} 
            className="md:hidden p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div className={`md:hidden overflow-hidden transition-all duration-300 ${
        isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
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
          
          {/* Mobile Notifications - only show when logged in */}
          {isLoggedIn && notifications.length > 0 && (
            <div className="pt-2 border-t border-white/10 mt-2">
              <div className="px-4 py-2 flex items-center gap-2">
                <Bell size={16} className="text-gray-400" />
                <span className="text-sm text-gray-400 font-medium">
                  Notifikasi {unreadCount > 0 && `(${unreadCount})`}
                </span>
              </div>
              <div className="max-h-60 overflow-y-auto space-y-1">
                {notifications.slice(0, 5).map((notif) => (
                  <button
                    key={notif.id}
                    onClick={() => {
                      handleNotificationClick(notif);
                      setIsOpen(false);
                    }}
                    className="w-full px-4 py-3 text-left rounded-xl hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-start gap-2">
                      <div className="mt-1 w-2 h-2 rounded-full flex-shrink-0 bg-gradient-to-r from-purple-600 to-pink-600" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium mb-1">
                          {notif.title}
                        </p>
                        <p className="text-gray-400 text-xs line-clamp-1">
                          {notif.message}
                        </p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
          
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
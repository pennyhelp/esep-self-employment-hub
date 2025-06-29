
import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Info, Grid, Search, Settings, LogOut } from 'lucide-react';
import { useAppStore } from '../store/appStore';
import { Button } from './ui/button';

const Navbar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentAdmin, setCurrentAdmin } = useAppStore();

  const handleLogout = () => {
    setCurrentAdmin(null);
    navigate('/');
  };

  const navItems = [
    { to: '/', label: 'Home', icon: Home },
    { to: '/about', label: 'About Project', icon: Info },
    { to: '/categories', label: 'Categories', icon: Grid },
    { to: '/status', label: 'Check Status', icon: Search },
  ];

  return (
    <nav className="bg-white shadow-md border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <h1 className="text-xl font-bold text-blue-600">E-LIFE SOCIETY</h1>
            </div>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.to}
                    to={item.to}
                    className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                      location.pathname === item.to
                        ? 'bg-blue-100 text-blue-700'
                        : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                    }`}
                  >
                    <Icon size={16} />
                    {item.label}
                  </Link>
                );
              })}
              
              {currentAdmin && currentAdmin.role === 'super' && (
                <Link
                  to="/admin/dashboard"
                  className={`px-3 py-2 rounded-md text-sm font-medium flex items-center gap-2 transition-colors ${
                    location.pathname.startsWith('/admin')
                      ? 'bg-blue-100 text-blue-700'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'
                  }`}
                >
                  <Settings size={16} />
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            {currentAdmin ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">
                  Welcome, {currentAdmin.username} ({currentAdmin.role})
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleLogout}
                  className="flex items-center gap-2"
                >
                  <LogOut size={16} />
                  Logout
                </Button>
              </div>
            ) : (
              <Link to="/admin/login">
                <Button variant="outline" size="sm">
                  Admin Login
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

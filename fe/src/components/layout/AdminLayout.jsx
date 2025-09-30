import { useState, useEffect } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '@/store/slices/authSlice';
import { toast } from 'react-toastify';

// Navigation configuration
const navigationConfig = [
  {
    name: 'Dashboard',
    href: '/admin/dashboard',
    icon: 'M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z',
  },
  {
    name: 'Quản lý người dùng',
    href: '/admin/users',
    icon: 'M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z',
  },
  {
    name: 'Duyệt việc làm',
    href: '/admin/jobs',
    icon: 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
  },
  {
    name: 'Danh mục công việc',
    href: '/admin/job-categories',
    icon: 'M19 11H5m14-7H5a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2V6a2 2 0 00-2-2z',
  },
  {
    name: 'Báo cáo vi phạm',
    href: '/admin/reports',
    icon: 'M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5l-6.928-7.5a2 2 0 00-2.928 0l-6.928 7.5c-.77.833.192 2.5 1.732 2.5z',
  },
  {
    name: 'Quản lý thanh toán',
    href: '/admin/payments',
    icon: 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
  },
  {
    name: 'Gói dịch vụ',
    href: '/admin/service-plans',
    icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4',
  },
  {
    name: 'Đăng ký dịch vụ',
    href: '/admin/subscriptions',
    icon: 'M16 15v-1a4 4 0 00-4-4H8m0 0l3 3m-3-3l3-3m9 14V5a2 2 0 00-2-2H6a2 2 0 00-2 2v16l4-2 4 2 4-2 4 2z',
  },
  {
    name: 'Template Email',
    href: '/admin/email-templates',
    icon: 'M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z',
   },
  {
    name: 'Thông báo hệ thống',
    href: '/admin/notifications',
    icon: 'M15 17h5l-5 5v-5zM4.828 7l10.586 10.586c.781.781 2.047.781 2.828 0l.586-.586c.781-.781.781-2.047 0-2.828L8.242 4.828c-.781-.781-2.047-.781-2.828 0l-.586.586c-.781.781-.781 2.047 0 2.828z',
  },
  {
    name: 'Thống kê & Phân tích',
    href: '/admin/analytics',
    icon: 'M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z',
  },
  {
    name: 'Bảo trì hệ thống',
    href: '/admin/maintenance',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
  {
    name: 'Cài đặt hệ thống',
    href: '/admin/settings',
    icon: 'M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z',
  },
];

// Icon component for reusability
const Icon = ({ paths, className = "w-6 h-6" }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    {Array.isArray(paths) ? paths.map((path, index) => (
      <path key={index} strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={path} />
    )) : (
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={paths} />
    )}
  </svg>
);

// Navigation item component
const NavigationItem = ({ item, isActive, isCollapsed, onClick }) => {
  const baseClasses = "group flex items-center px-2 py-2 text-sm font-medium rounded-md transition-all duration-200";
  const activeClasses = isActive 
    ? "bg-gradient-to-r from-primary-100 to-primary-50 text-primary-900 border-l-4 border-primary-600 shadow-md" 
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900 hover:shadow-sm";
  
  return (
    <Link
      to={item.href}
      className={`${baseClasses} ${activeClasses} ${isCollapsed ? 'justify-center px-3' : ''}`}
      title={isCollapsed ? item.name : ''}
      onClick={onClick}
    >
      <Icon 
        paths={item.icon} 
        className={`h-6 w-6 flex-shrink-0 ${isCollapsed ? '' : 'mr-3'} ${isActive ? 'text-primary-700 stroke-[2.5]' : 'text-gray-500'}`} 
      />
      {!isCollapsed && <span className="truncate font-semibold">{item.name}</span>}
    </Link>
  );
};

// Sidebar component
const Sidebar = ({ navigation, location, isCollapsed, isMobileOpen, onMobileClose }) => {  
  return (
    <div className="flex flex-col h-full bg-white border-r border-gray-200 shadow-sm">
      <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
        {/* Logo/Brand */}
        <div className={`flex items-center flex-shrink-0 px-4 mb-6 ${isCollapsed ? 'justify-center' : ''}`}>
          {isCollapsed ? (
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-lg">
              <span className=" font-bold text-lg">IT</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
                <span className=" font-bold text-sm">IT</span>
              </div>
              <h1 className="text-xl font-bold ">
                Jobs Admin
              </h1>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="mt-2 flex-1 px-2 space-y-1 overflow-y-auto">
          {navigation.map((item) => (
            <NavigationItem
              key={item.name}
              item={item}
              isActive={location.pathname === item.href}
              isCollapsed={isCollapsed}
              onClick={onMobileClose}
            />
          ))}
        </nav>
      </div>
    </div>
  );
};

// Header component
const Header = ({ 
  user, 
  notificationCount, 
  sidebarCollapsed, 
  onSidebarToggle, 
  onMobileSidebarOpen, 
  onLogout 
}) => (
  <div className="sticky top-0 z-30  shadow-sm border-b border-gray-200 backdrop-blur-lg bg-white/95">
    <div className="px-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center h-16">
        <div className="flex items-center space-x-4">
          {/* Mobile sidebar toggle */}
          <button
            type="button"
            className="lg:hidden -ml-0.5 -mt-0.5 h-10 w-10 inline-flex items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-colors duration-200"
            onClick={onMobileSidebarOpen}
          >
            <Icon paths="M4 6h16M4 12h16M4 18h16" className="h-6 w-6" />
          </button>
          
          {/* Desktop sidebar collapse toggle */}
          <button
            type="button"
            className="hidden lg:inline-flex h-10 w-10 items-center justify-center rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all duration-200"
            onClick={onSidebarToggle}
          >
            <Icon 
              paths={sidebarCollapsed 
                ? "M13 5l7 7-7 7M5 5l7 7-7 7" 
                : "M11 19l-7-7 7-7m8 14l-7-7 7-7"
              } 
              className="h-5 w-5" 
            />
          </button>

          {/* Breadcrumb or current page indicator could go here */}
        </div>

        <div className="flex items-center space-x-4">
          {/* Notifications */}
          <div className="relative">
            <button className="relative p-2 text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 rounded-lg transition-colors duration-200">
              <Icon paths="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              {notificationCount > 0 && (
                <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center animate-pulse">
                  {notificationCount > 9 ? '9+' : notificationCount}
                </span>
              )}
            </button>
          </div>

          {/* User menu */}
          <div className="relative flex items-center space-x-3 pl-3 border-l border-gray-200">
            <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center text-black font-semibold shadow-md">
              {user?.name?.charAt(0)?.toUpperCase() || "A"}
            </div>
            <div className="hidden sm:block">
              <div className="text-sm font-medium text-gray-900 truncate max-w-[120px]">
                {user?.full_name ||user?.username ||  'Administrator'}
              </div>
              <div className="text-xs text-gray-500">Quản trị viên</div>
            </div>
            <button
              onClick={onLogout}
              className="p-2 text-gray-400 hover:text-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 rounded-lg transition-colors duration-200"
              title="Đăng xuất"
            >
              <Icon paths="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
);

// Mobile sidebar overlay
const MobileSidebar = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex z-50 lg:hidden">
      <div 
        className="fixed inset-0 bg-gray-600 bg-opacity-75 transition-opacity" 
        onClick={onClose} 
      />
      <div className="relative flex-1 flex flex-col max-w-xs w-full bg-white">
        <div className="absolute top-0 right-0 -mr-12 pt-2">
          <button
            type="button"
            className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white text-white hover:bg-white/10 transition-colors duration-200"
            onClick={onClose}
          >
            <Icon paths="M6 18L18 6M6 6l12 12" className="h-6 w-6" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};

const AdminLayout = () => {
  // State management
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [notificationCount, setNotificationCount] = useState(3);
  
  // Redux and routing
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle window resize for responsive sidebar
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) { // lg breakpoint
        setSidebarOpen(false);
      }
      
      // Auto-collapse on medium screens
      if (window.innerWidth < 1024 && window.innerWidth >= 768) {
        setSidebarCollapsed(true);
      }
    };

    handleResize(); // Check on mount
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Persist sidebar state in localStorage (only for desktop)
  useEffect(() => {
    if (window.innerWidth >= 1024) {
      const savedCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
      setSidebarCollapsed(savedCollapsed);
    }
  }, []);

  useEffect(() => {
    if (window.innerWidth >= 1024) {
      localStorage.setItem('sidebarCollapsed', sidebarCollapsed.toString());
    }
  }, [sidebarCollapsed]);

 
  // Handlers
  const handleLogout = () => {
    dispatch(logout());
    toast.success("Đăng xuất thành công");
    navigate("/");
  };

  const handleSidebarToggle = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const handleMobileSidebarOpen = () => {
    setSidebarOpen(true);
  };

  const handleMobileSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar */}
      <MobileSidebar isOpen={sidebarOpen} onClose={handleMobileSidebarClose}>
        <Sidebar
          navigation={navigationConfig}
          location={location}
          isCollapsed={false}
          isMobileOpen={sidebarOpen}
          onMobileClose={handleMobileSidebarClose}
        />
      </MobileSidebar>

      {/* Desktop Sidebar */}
      <div className={`hidden lg:fixed lg:inset-y-0 lg:flex lg:flex-col transition-all duration-300 z-40 ${
        sidebarCollapsed ? 'lg:w-20' : 'lg:w-64'
      }`}>
        <Sidebar
          navigation={navigationConfig}
          location={location}
          isCollapsed={sidebarCollapsed}
          isMobileOpen={false}
          onMobileClose={() => {}}
        />
      </div>

      {/* Main Content */}
      <div className={`flex flex-col min-h-screen transition-all duration-300 ${
        sidebarCollapsed ? 'lg:pl-20' : 'lg:pl-64'
      }`}>
        {/* Header */}
        <Header
          user={user}
          notificationCount={notificationCount}
          sidebarCollapsed={sidebarCollapsed}
          onSidebarToggle={handleSidebarToggle}
          onMobileSidebarOpen={handleMobileSidebarOpen}
          onLogout={handleLogout}
        />

        {/* Main content area */}
        <main className="flex-1 overflow-auto">
          <div className="h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
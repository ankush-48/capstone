import { useMember } from '@/integrations';
import { useLanguage } from '@/contexts/LanguageContext';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LanguageSelector } from '@/components/ui/language-selector';
import { 
  BookOpen, 
  User, 
  LayoutDashboard,
  Menu,
  X,
  GraduationCap,
  Settings,
  Award
} from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Layout() {
  const { member, isAuthenticated, isLoading, actions } = useMember();
  const { t } = useLanguage();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/', icon: GraduationCap },
    { name: t('nav.courses'), href: '/courses', icon: BookOpen },
  ];

  const authenticatedNavigation = [
    { name: t('nav.dashboard'), href: '/dashboard', icon: LayoutDashboard },
    { name: 'Certificates', href: '/certificates', icon: Award },
    { name: t('nav.profile'), href: '/profile', icon: User },
  ];

  // Admin navigation (only show for admin users)
  const adminNavigation = [
    { name: t('nav.admin'), href: '/admin', icon: Settings },
  ];

  const isActivePath = (path: string) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-surface/50 backdrop-blur-sm border-b border-white/10 sticky top-0 z-50">
        <nav className="max-w-[100rem] mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold font-heading text-white">
                LearnHub
              </span>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-8">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-paragraph text-sm transition-colors ${
                    isActivePath(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}

              {isAuthenticated && authenticatedNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-paragraph text-sm transition-colors ${
                    isActivePath(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}

              {isAuthenticated && adminNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg font-paragraph text-sm transition-colors ${
                    isActivePath(item.href)
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <item.icon className="w-4 h-4" />
                  {item.name}
                </Link>
              ))}
            </div>

            {/* Auth Section */}
            <div className="hidden md:flex items-center gap-4">
              <LanguageSelector />
              {isLoading ? (
                <LoadingSpinner />
              ) : isAuthenticated ? (
                <div className="flex items-center gap-3">
                  <span className="font-paragraph text-gray-400 text-sm">
                    {member?.profile?.nickname || member?.contact?.firstName || 'User'}
                  </span>
                  <Button
                    onClick={actions.logout}
                    variant="outline"
                    size="sm"
                    className="border-white/20 text-gray-400 hover:text-white"
                  >
                    {t('nav.signOut')}
                  </Button>
                </div>
              ) : (
                <Button
                  onClick={actions.login}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  {t('nav.signIn')}
                </Button>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-gray-400 hover:text-white"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>

          {/* Mobile Navigation */}
          <AnimatePresence>
            {mobileMenuOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.2 }}
                className="md:hidden border-t border-white/10 mt-4 pt-4"
              >
                <div className="space-y-2">
                  {navigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg font-paragraph transition-colors ${
                        isActivePath(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}

                  {isAuthenticated && authenticatedNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg font-paragraph transition-colors ${
                        isActivePath(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}

                  {isAuthenticated && adminNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-3 rounded-lg font-paragraph transition-colors ${
                        isActivePath(item.href)
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-400 hover:text-white hover:bg-white/5'
                      }`}
                    >
                      <item.icon className="w-5 h-5" />
                      {item.name}
                    </Link>
                  ))}

                  <div className="border-t border-white/10 pt-4 mt-4">
                    <div className="mb-4">
                      <LanguageSelector />
                    </div>
                    {isLoading ? (
                      <div className="flex justify-center">
                        <LoadingSpinner />
                      </div>
                    ) : isAuthenticated ? (
                      <div className="space-y-3">
                        <div className="px-3 py-2 text-gray-400 font-paragraph text-sm">
                          Signed in as {member?.profile?.nickname || member?.contact?.firstName || 'User'}
                        </div>
                        <Button
                          onClick={() => {
                            actions.logout();
                            setMobileMenuOpen(false);
                          }}
                          variant="outline"
                          className="w-full border-white/20 text-gray-400 hover:text-white"
                        >
                          {t('nav.signOut')}
                        </Button>
                      </div>
                    ) : (
                      <Button
                        onClick={() => {
                          actions.login();
                          setMobileMenuOpen(false);
                        }}
                        className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                      >
                        {t('nav.signIn')}
                      </Button>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </header>

      {/* Main Content */}
      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-surface/30 border-t border-white/10 mt-auto">
        <div className="max-w-[100rem] mx-auto px-6 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Brand */}
            <div className="md:col-span-1">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <GraduationCap className="w-5 h-5 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold font-heading text-white">
                  LearnHub
                </span>
              </div>
              <p className="font-paragraph text-gray-400 text-sm">
                Empowering learners worldwide with cutting-edge courses and expert instruction.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="font-heading text-white font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                {navigation.map((item) => (
                  <li key={item.name}>
                    <Link
                      to={item.href}
                      className="font-paragraph text-gray-400 text-sm hover:text-primary transition-colors"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Learning */}
            <div>
              <h3 className="font-heading text-white font-semibold mb-4">Learning</h3>
              <ul className="space-y-2 font-paragraph text-gray-400 text-sm">
                <li><span>Certificates</span></li>
                <li><span>Progress Tracking</span></li>
                <li><span>Expert Instructors</span></li>
                <li><span>Community Support</span></li>
              </ul>
            </div>

            {/* Legal */}
            <div>
              <h3 className="font-heading text-white font-semibold mb-4">Legal</h3>
              <ul className="space-y-2 font-paragraph text-gray-400 text-sm">
                <li><span>Privacy Policy</span></li>
                <li><span>Terms of Service</span></li>
                <li><span>Cookie Policy</span></li>
                <li><span>Accessibility</span></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-white/10 mt-8 pt-8 text-center">
            <p className="font-paragraph text-gray-500 text-sm">
              © 2024 LearnHub. All rights reserved. Built with modern web technologies for the future of learning.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
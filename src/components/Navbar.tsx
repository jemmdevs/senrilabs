import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface SubItem {
  name: string;
  href: string;
}

interface NavItem {
  name: string;
  href: string;
  subItems?: SubItem[];
}

interface MousePosition {
  x: number;
  y: number;
  time: number;
}

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeItemBySection, setActiveItemBySection] = useState<{
    humanInterface: string | null;
    webInterfaces: string | null;
  }>({
    humanInterface: null,
    webInterfaces: null,
  });

  const [hoveredItem, setHoveredItem] = useState<{
    section: 'humanInterface' | 'webInterfaces' | null;
    item: string | null;
  }>({ section: null, item: null });

  const mouseHistory = useRef<MousePosition[]>([]);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mouseHistory.current.push({ x: e.clientX, y: e.clientY, time: now });
      if (mouseHistory.current.length > 3) {
        mouseHistory.current.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Close mobile menu when resizing to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024 && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [isMobileMenuOpen]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    // Cleanup on unmount
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isMovingTowardsSubmenu = (section: 'humanInterface' | 'webInterfaces'): boolean => {
    if (mouseHistory.current.length < 2) return false;

    const recent = mouseHistory.current[mouseHistory.current.length - 1];
    const prev = mouseHistory.current[mouseHistory.current.length - 2];

    const deltaY = recent.y - prev.y;
    const deltaX = Math.abs(recent.x - prev.x);

    return deltaY > 0 && deltaX < 50;
  };

  const handleItemHover = (section: 'humanInterface' | 'webInterfaces', itemName: string) => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
      leaveTimeoutRef.current = null;
    }
    
    setHoveredItem({ section, item: itemName });
    setActiveItemBySection((prev) => ({
      ...prev,
      [section]: itemName,
    }));
  };

  const handleItemClick = (section: 'humanInterface' | 'webInterfaces', itemName: string) => {
    // Toggle on mobile
    setActiveItemBySection((prev) => ({
      ...prev,
      [section]: prev[section] === itemName ? null : itemName,
    }));
  };

  const handleItemLeave = (section: 'humanInterface' | 'webInterfaces') => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }

    if (isMovingTowardsSubmenu(section)) {
      leaveTimeoutRef.current = setTimeout(() => {
        setActiveItemBySection((prev) => ({
          ...prev,
          [section]: null,
        }));
        setHoveredItem({ section: null, item: null });
      }, 400);
    } else {
      leaveTimeoutRef.current = setTimeout(() => {
        setActiveItemBySection((prev) => ({
          ...prev,
          [section]: null,
        }));
        setHoveredItem({ section: null, item: null });
      }, 200);
    }
  };

  const handleSectionLeave = (section: 'humanInterface' | 'webInterfaces') => {
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }
    setActiveItemBySection((prev) => ({
      ...prev,
      [section]: null,
    }));
    setHoveredItem({ section: null, item: null });
  };

  const humanInterfaceItems: NavItem[] = [
    {
      name: 'Cognitive Design',
      href: '/cognitive-design',
      subItems: [
        { name: 'Components', href: '/cognitive-design/components' },
        { name: 'Guidelines', href: '/cognitive-design/guidelines' },
      ],
    },
    {
      name: 'Spatial Interfaces',
      href: '/spatial-interfaces',
      subItems: [
        { name: 'Components', href: '/spatial-interfaces/components' },
        { name: 'Guidelines', href: '/spatial-interfaces/guidelines' },
      ],
    },
  ];

  const webInterfacesItems: NavItem[] = [
    {
      name: 'Utility UI',
      href: '/web-interfaces/utility-ui',
      subItems: [
        { name: 'Components', href: '/web-interfaces/utility-ui/components' },
        { name: 'Guidelines', href: '/web-interfaces/utility-ui/guidelines' },
      ],
    },
    {
      name: 'Expressive UI',
      href: '/web-interfaces/expressive-ui',
      subItems: [
        { name: 'Components', href: '/web-interfaces/expressive-ui/components' },
        { name: 'Guidelines', href: '/web-interfaces/expressive-ui/guidelines' },
      ],
    },
  ];

  const renderNavItem = (item: NavItem, section: 'humanInterface' | 'webInterfaces', isMobile: boolean = false) => {
    const isActive = activeItemBySection[section] === item.name;
    
    return (
      <div
        key={item.name}
        className="relative"
        onMouseEnter={() => {
          if (!isMobile && item.subItems) {
            handleItemHover(section, item.name);
          }
        }}
        onMouseLeave={() => {
          if (!isMobile && item.subItems) {
            handleItemLeave(section);
          }
        }}
      >
        <div className="py-0.5 px-4">
          <a
            href={item.href}
            onClick={(e) => {
              if (isMobile && item.subItems) {
                // If submenu is already open, allow navigation
                if (isActive) {
                  setIsMobileMenuOpen(false);
                } else {
                  // If submenu is closed, open it
                  e.preventDefault();
                  handleItemClick(section, item.name);
                }
              }
            }}
            className="inline-block text-sm text-black hover:text-gray-500 transition-colors duration-200"
          >
            {item.name}
          </a>
        </div>

        {/* Submenu */}
        {item.subItems && (
          <div className="overflow-hidden">
            <AnimatePresence mode="wait">
              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                  transition={{ 
                    duration: 0.3, 
                    ease: [0.25, 0.1, 0.25, 1]
                  }}
                  className="ml-4 space-y-0 border-l-2 border-gray-300 pl-3 mb-1"
                  onMouseEnter={() => {
                    if (!isMobile && leaveTimeoutRef.current) {
                      clearTimeout(leaveTimeoutRef.current);
                      leaveTimeoutRef.current = null;
                    }
                  }}
                  onMouseLeave={() => {
                    if (!isMobile) {
                      handleItemLeave(section);
                    }
                  }}
                >
                  {item.subItems.map((subItem, index) => (
                    <motion.div 
                      key={subItem.name} 
                      className="py-0.5"
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ 
                        duration: 0.2,
                        delay: index * 0.03,
                        ease: [0.25, 0.1, 0.25, 1]
                      }}
                    >
                      <a
                        href={subItem.href}
                        onClick={() => {
                          if (isMobile) {
                            setIsMobileMenuOpen(false);
                          }
                        }}
                        className="inline-block text-xs text-black hover:text-gray-500 transition-colors duration-150"
                      >
                        {subItem.name}
                      </a>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        className="lg:hidden fixed top-4 right-4 z-50 w-12 h-12 flex flex-col items-center justify-center bg-white rounded-lg shadow-lg border border-gray-200"
        aria-label="Toggle menu"
      >
        <span className={`block w-6 h-0.5 bg-black transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black mt-1.5 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
        <span className={`block w-6 h-0.5 bg-black mt-1.5 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
      </button>

      {/* Desktop Navbar */}
      <nav className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex-col py-6 px-6">
        {/* Section 1: Personal Links */}
        <div className="mb-3">
          <a 
            href="/" 
            className="bg-[#F1F1F1] px-4 py-2 mb-2 inline-block hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
          >
            <h1 className="text-[20px] font-semibold text-black">丂乇刀尺ﾉ</h1>
          </a>
          <div className="space-y-0.5">
            <div className="py-0.5 px-4">
              <a
                href="https://josencv.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[20px] text-black font-semibold hover:text-gray-500 transition-colors duration-200"
              >
                Work
              </a>
            </div>
            <div className="py-0.5 px-4">
              <a
                href="https://senrilab.vercel.app"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-[20px] text-black font-semibold hover:text-gray-500 transition-colors duration-200"
              >
                Blog
              </a>
            </div>
            <div className="py-0.5 px-4">
              <a
                href="/cv"
                className="inline-block text-[20px] text-black font-semibold hover:text-gray-500 transition-colors duration-200"
              >
                CV
              </a>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3 -mx-6"></div>

        {/* Section 2: Human Interface & Web Interfaces */}
        <div className="flex-shrink-0">
          {/* Human Interface */}
          <div 
            className="mb-8"
            onMouseLeave={() => handleSectionLeave('humanInterface')}
          >
            <h2 className="text-[16px] font-semibold tracking-wider text-gray-400 px-4 py-1 mb-0">
              HUMAN INTERFACE
            </h2>
            <div className="space-y-1">
              {humanInterfaceItems.map((item) => renderNavItem(item, 'humanInterface', false))}
            </div>
          </div>

          {/* Web Interfaces */}
          <div 
            className="mb-3"
            onMouseLeave={() => handleSectionLeave('webInterfaces')}
          >
            <h2 className="text-[16px] font-semibold tracking-wider text-gray-400 px-4 py-1 mb-0">
              WEB INTERFACES
            </h2>
            <div className="space-y-1">
              {webInterfacesItems.map((item) => renderNavItem(item, 'webInterfaces', false))}
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-200 my-3 -mx-6"></div>

        {/* Section 3: Contact */}
        <div>
          <h2 className="text-[16px] font-semibold tracking-wider text-gray-400 px-4 py-1 mb-0.5">
            CONTACT ME
          </h2>
          <div className="space-y-0.5">
            <div className="py-0.5 px-4">
              <a
                href="https://github.com/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-black hover:text-gray-500 transition-colors duration-200"
              >
                GitHub
              </a>
            </div>
            <div className="py-0.5 px-4">
              <a
                href="https://linkedin.com/in/yourusername"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-block text-sm text-black hover:text-gray-500 transition-colors duration-200"
              >
                LinkedIn
              </a>
            </div>
            <div className="py-0.5 px-4">
              <a
                href="mailto:your@email.com"
                className="inline-block text-sm text-black hover:text-gray-500 transition-colors duration-200"
              >
                Email
              </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'tween', duration: 0.3 }}
            className="lg:hidden fixed inset-0 z-40 bg-white overflow-y-auto overscroll-contain"
            style={{ overscrollBehavior: 'contain' }}
          >
            <div className="flex flex-col py-20 px-6">
              {/* Section 1: Personal Links */}
              <div className="mb-6">
                <a 
                  href="/" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="bg-[#F1F1F1] px-4 py-2 mb-4 inline-block hover:bg-gray-200 transition-colors duration-200 cursor-pointer"
                >
                  <h1 className="text-[24px] font-semibold text-black">丂乇刀尺ﾉ</h1>
                </a>
                <div className="space-y-2">
                  <div className="py-1 px-4">
                    <a
                      href="https://josencv.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-block text-[24px] text-black font-semibold hover:text-gray-500 transition-colors duration-200"
                    >
                      Work
                    </a>
                  </div>
                  <div className="py-1 px-4">
                    <a
                      href="https://senrilab.vercel.app"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-block text-[24px] text-black font-semibold hover:text-gray-500 transition-colors duration-200"
                    >
                      Blog
                    </a>
                  </div>
                  <div className="py-1 px-4">
                    <a
                      href="/cv"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-block text-[24px] text-black font-semibold hover:text-gray-500 transition-colors duration-200"
                    >
                      CV
                    </a>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Section 2: Human Interface & Web Interfaces */}
              <div className="flex-shrink-0">
                {/* Human Interface */}
                <div className="mb-6">
                  <h2 className="text-[18px] font-semibold tracking-wider text-gray-400 px-4 py-2 mb-2">
                    HUMAN INTERFACE
                  </h2>
                  <div className="space-y-2">
                    {humanInterfaceItems.map((item) => renderNavItem(item, 'humanInterface', true))}
                  </div>
                </div>

                {/* Web Interfaces */}
                <div className="mb-6">
                  <h2 className="text-[18px] font-semibold tracking-wider text-gray-400 px-4 py-2 mb-2">
                    WEB INTERFACES
                  </h2>
                  <div className="space-y-2">
                    {webInterfacesItems.map((item) => renderNavItem(item, 'webInterfaces', true))}
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-200 my-4"></div>

              {/* Section 3: Contact */}
              <div>
                <h2 className="text-[16px] font-semibold tracking-wider text-gray-400 px-4 py-2 mb-2">
                  CONTACT ME
                </h2>
                <div className="space-y-2">
                  <div className="py-1 px-4">
                    <a
                      href="https://github.com/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-block text-base text-black hover:text-gray-500 transition-colors duration-200"
                    >
                      GitHub
                    </a>
                  </div>
                  <div className="py-1 px-4">
                    <a
                      href="https://linkedin.com/in/yourusername"
                      target="_blank"
                      rel="noopener noreferrer"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-block text-base text-black hover:text-gray-500 transition-colors duration-200"
                    >
                      LinkedIn
                    </a>
                  </div>
                  <div className="py-1 px-4">
                    <a
                      href="mailto:your@email.com"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="inline-block text-base text-black hover:text-gray-500 transition-colors duration-200"
                    >
                      Email
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;

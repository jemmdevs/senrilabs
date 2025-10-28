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
  const [activeItemBySection, setActiveItemBySection] = useState<{
    humanInterface: string | null;
    webDesign: string | null;
  }>({
    humanInterface: null,
    webDesign: null,
  });

  const [hoveredItem, setHoveredItem] = useState<{
    section: 'humanInterface' | 'webDesign' | null;
    item: string | null;
  }>({ section: null, item: null });

  const mouseHistory = useRef<MousePosition[]>([]);
  const leaveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Track mouse position
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      mouseHistory.current.push({ x: e.clientX, y: e.clientY, time: now });
      // Keep only last 3 positions for direction calculation
      if (mouseHistory.current.length > 3) {
        mouseHistory.current.shift();
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const isMovingTowardsSubmenu = (section: 'humanInterface' | 'webDesign'): boolean => {
    if (mouseHistory.current.length < 2) return false;

    const recent = mouseHistory.current[mouseHistory.current.length - 1];
    const prev = mouseHistory.current[mouseHistory.current.length - 2];

    // Calculate if moving down (towards submenu which is below)
    const deltaY = recent.y - prev.y;
    const deltaX = Math.abs(recent.x - prev.x);

    // If moving down and not too much horizontal movement, consider it "towards submenu"
    // Positive deltaY = moving down, which is towards the submenu
    return deltaY > 0 && deltaX < 50;
  };

  const handleItemHover = (section: 'humanInterface' | 'webDesign', itemName: string) => {
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

  const handleItemLeave = (section: 'humanInterface' | 'webDesign') => {
    // Clear any existing timeout
    if (leaveTimeoutRef.current) {
      clearTimeout(leaveTimeoutRef.current);
    }

    // Check if mouse is moving towards submenu
    if (isMovingTowardsSubmenu(section)) {
      // Give more time if moving towards submenu (400ms)
      leaveTimeoutRef.current = setTimeout(() => {
        setActiveItemBySection((prev) => ({
          ...prev,
          [section]: null,
        }));
        setHoveredItem({ section: null, item: null });
      }, 400);
    } else {
      // Delay even when moving away to allow smooth transitions (200ms)
      leaveTimeoutRef.current = setTimeout(() => {
        setActiveItemBySection((prev) => ({
          ...prev,
          [section]: null,
        }));
        setHoveredItem({ section: null, item: null });
      }, 200);
    }
  };

  const handleSectionLeave = (section: 'humanInterface' | 'webDesign') => {
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

  const webDesignItems: NavItem[] = [
    {
      name: 'Utility UI',
      href: '/web-design/utility-ui',
      subItems: [
        { name: 'Components', href: '/web-design/utility-ui/components' },
        { name: 'Guidelines', href: '/web-design/utility-ui/guidelines' },
      ],
    },
    {
      name: 'Expressive UI',
      href: '/web-design/expressive-ui',
      subItems: [
        { name: 'Components', href: '/web-design/expressive-ui/components' },
        { name: 'Guidelines', href: '/web-design/expressive-ui/guidelines' },
      ],
    },
  ];

  const renderNavItem = (item: NavItem, section: 'humanInterface' | 'webDesign') => {
    const isActive = activeItemBySection[section] === item.name;
    
    return (
      <div
        key={item.name}
        className="relative"
        onMouseEnter={() => {
          if (item.subItems) {
            handleItemHover(section, item.name);
          }
        }}
        onMouseLeave={() => {
          if (item.subItems) {
            handleItemLeave(section);
          }
        }}
      >
        <div className="py-0.5 px-4">
          <a
            href={item.href}
            className="inline-block text-sm text-black hover:text-gray-500 transition-colors duration-200"
          >
            {item.name}
          </a>
        </div>

        {/* Reserve space for submenu to prevent layout shifts */}
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
                    if (leaveTimeoutRef.current) {
                      clearTimeout(leaveTimeoutRef.current);
                      leaveTimeoutRef.current = null;
                    }
                  }}
                  onMouseLeave={() => handleItemLeave(section)}
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
    <nav className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 flex flex-col py-6 px-6">
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

      {/* Section 2: Human Interface & Web Design */}
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
            {humanInterfaceItems.map((item) => renderNavItem(item, 'humanInterface'))}
          </div>
        </div>

        {/* Web Design */}
        <div 
          className="mb-3"
          onMouseLeave={() => handleSectionLeave('webDesign')}
        >
          <h2 className="text-[16px] font-semibold tracking-wider text-gray-400 px-4 py-1 mb-0">
            WEB DESIGN
          </h2>
          <div className="space-y-1">
            {webDesignItems.map((item) => renderNavItem(item, 'webDesign'))}
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200 my-3 -mx-6"></div>

      {/* Section 3: Contact */}
      <div>
        <h2 className="text-[14px] font-semibold tracking-wider text-gray-400 px-4 py-1 mb-0.5">
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
  );
};

export default Navbar;
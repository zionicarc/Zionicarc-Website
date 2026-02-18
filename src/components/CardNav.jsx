import React, { useState, useEffect } from 'react';
import { Menu, X, ChevronDown } from 'lucide-react';

const CardNav = ({ logo, logoAlt, items }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeAccordion, setActiveAccordion] = useState(null);

  // Toggle body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActiveAccordion(null);
    }
  }, [isOpen]);

  // Fallback items if prop is missing
  const safeItems = items && items.length > 0 ? items : [
    { label: "Our Expertise", href: "#services", links: [] },
    { label: "Our Approach", href: "#approach", links: [] },
    { label: "Our Work", href: "#projects", links: [] }
  ];

  return (
    <>
      {/* Navbar Container */}
      <header className="fixed top-0 left-0 w-full z-50 transition-all duration-300">
        {/* Main Header Row */}
        <div className="bg-white/80 backdrop-blur-lg border-b border-black/5 px-6 h-20 md:h-24 flex items-center justify-between">

          {/* Logo Section */}
          <div className="flex items-center gap-3 group cursor-pointer">
            <div className="w-10 h-10 md:w-12 md:h-12 bg-black rounded-full flex items-center justify-center transition-transform group-hover:rotate-12">
              <img src={logo} alt={logoAlt} className="w-6 h-6 md:w-7 md:h-7 invert" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-montserrat text-lg md:text-xl font-black tracking-tighter uppercase">Z'IONIC ARC</span>
              <span className="text-[10px] tracking-[0.3em] font-medium text-black/40 uppercase pl-0.5">Architecture</span>
            </div>
          </div>

          {/* Desktop Navigation (Center/Right) */}
          <nav className="hidden lg:flex items-center gap-12 font-bold uppercase tracking-[0.2em] text-[11px]">
            {safeItems.map((item) => (
              <a
                key={item.label}
                href={item.href || `#${item.label.toLowerCase()}`}
                className="text-black hover:text-black/40 transition-colors"
              >
                {item.label}
              </a>
            ))}
            <a
              href="#contact"
              className="bg-black text-white px-8 py-3 rounded-full hover:bg-black/80 transition-all hover:scale-105 active:scale-95"
            >
              Start a Project
            </a>
          </nav>

          {/* Advanced Mobile Menu Trigger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden flex items-center gap-3 py-2 px-5 bg-black rounded-full active:scale-95 transition-all text-white shadow-lg"
            aria-label="Toggle menu"
          >
            <span className="text-[9px] font-black uppercase tracking-[0.3em] mt-0.5">
              {isOpen ? 'Close' : 'Menu'}
            </span>
            <div className="relative w-4 h-4 flex flex-col justify-center gap-1.2 overflow-hidden">
              <span className={`w-full h-[1.5px] bg-white transition-all duration-500 ${isOpen ? 'rotate-45 translate-y-1' : ''}`} />
              <span className={`w-full h-[1.5px] bg-white transition-all duration-500 ${isOpen ? '-rotate-45 -translate-y-1' : ''}`} />
            </div>
          </button>
        </div>
      </header>

      {/* Classic Mobile Menu Overlay */}
      <div className={`fixed inset-0 z-40 lg:hidden pointer-events-none ${isOpen ? 'pointer-events-auto' : ''}`}>
        {/* Animated Background Panel */}
        <div className={`absolute inset-0 bg-black/30 backdrop-blur-sm transition-opacity duration-500 ${isOpen ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`absolute top-4 bottom-4 right-4 w-[65vw] md:w-[320px] bg-white rounded-3xl shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${isOpen ? 'translate-x-0' : 'translate-x-[110%]'}`}>

          <div className="h-full flex flex-col px-7 pt-20 pb-8 overflow-y-auto">
            {/* Overlay Navigation Links */}
            <div className="flex flex-col gap-6">
              <span className="text-[9px] font-bold tracking-[0.2em] text-black/30 uppercase border-b border-black/5 pb-3 mb-1">
                Menu
              </span>

              <a
                href="#"
                onClick={() => setIsOpen(false)}
                className="text-base font-bold uppercase tracking-widest text-black hover:text-black/40 transition-colors"
              >
                Home
              </a>

              {safeItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href || `#${item.label.toLowerCase()}`}
                  onClick={() => setIsOpen(false)}
                  className="text-base font-bold uppercase tracking-widest text-black hover:text-black/40 transition-colors"
                >
                  {item.label}
                </a>
              ))}

              <a
                href="#contact"
                onClick={() => setIsOpen(false)}
                className="text-base font-bold uppercase tracking-widest text-black hover:text-black/40 transition-colors"
              >
                Contact
              </a>

              <div className="mt-8 pt-8 border-t border-black/5 flex flex-col gap-4">
                <span className="text-[9px] font-bold tracking-[0.2em] text-black/30 uppercase">
                  Let's Talk
                </span>
                <div className="flex flex-col gap-2">
                  <a href="mailto:contact@zionicarc.com" className="text-xs font-medium text-black hover:opacity-50 transition-opacity underline underline-offset-4 tracking-tight">contact@zionicarc.com</a>
                  <div className="flex gap-4 mt-2">
                    <a href="#" className="text-[10px] font-bold text-black/40 hover:text-black transition-colors uppercase tracking-[0.2em]">Instagram</a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Spacer */}
      <div className="h-20 md:h-24" />
    </>
  );
};

export default CardNav;

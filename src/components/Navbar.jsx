import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import { useSite } from "../context/SiteContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { settings } = useSite();

  // Toggle body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const navLinks = [
    { label: "Home", href: "#", show: true },
    { label: "About Us", href: "#about", show: settings.showAbout },
    { label: "Our Vision", href: "#vision", show: settings.showVision },
    { label: "Our Expertise", href: "#expertise", show: settings.showExpertise },
    { label: "Our Approach", href: "#approach", show: settings.showApproach },
    { label: "Our Services", href: "#detailed-services", show: settings.showServices },
    { label: "Why Choose Us", href: "#why-choose-us", show: settings.showWhyChooseUs },
    { label: "Our Work", href: "#projects", show: settings.showProjects },
    { label: "Contact", href: "#contact", show: settings.showContact },
  ].filter(link => link.show);

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Reduced Header Height on Mobile: h-16 vs h-20 */}
      <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-black/5 h-16 xl:h-19 flex items-center transition-all px-4 xl:px-0">
        <div className="max-w-[1440px] mx-auto w-full xl:px-4 2xl:px-14 flex items-center justify-between">

          <div className="flex items-center gap-3 xl:gap-4 2xl:gap-16">
            {/* Logo */}
            <a href="#" className="font-montserrat text-lg xl:text-xl tracking-[0.1em] 2xl:tracking-[0.2em] font-light uppercase whitespace-nowrap">
              <span className="text-[#808000]">Z'IONIC</span> <span className="font-bold">ARC</span>
            </a>

            {/* Desktop Nav Links */}
            <ul className="hidden xl:flex items-center gap-2 2xl:gap-8 font-outfit text-[10px] 2xl:text-[11px] font-medium uppercase tracking-tight 2xl:tracking-[0.2em] text-black">
              {navLinks.filter(link => link.label !== "Contact").map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-black/40 transition-colors whitespace-nowrap">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop Right Action */}
          <div className="hidden xl:flex items-center">
            {settings.showContact && (
              <a
                href="#contact"
                className="bg-black text-white px-5 xl:px-6 2xl:px-8 py-3 rounded-full font-outfit text-[10px] 2xl:text-[11px] font-bold uppercase tracking-tight 2xl:tracking-[0.2em] transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-lg shadow-black/10 whitespace-nowrap"
              >
                Start Your Project
              </a>
            )}
          </div>

          {/* Dual-State Mobile Toggle Button */}
          <button
            className={`xl:hidden flex items-center justify-center transition-all duration-300 active:scale-90 z-[60] ${open ? 'w-10 h-10 bg-black rounded-2xl shadow-lg' : 'w-8 h-8 bg-transparent'
              }`}
            onClick={() => setOpen(!open)}
            aria-label="Toggle Menu"
          >
            {open ? (
              <div className="relative w-5 h-5 flex items-center justify-center">
                {/* Bolder White X built with standard divs to ensure visibility */}
                <div className="absolute w-[18px] h-[2.5px] bg-white rounded-full rotate-45 shadow-[0_0_2px_rgba(255,255,255,0.5)]" />
                <div className="absolute w-[18px] h-[2.5px] bg-white rounded-full -rotate-45 shadow-[0_0_2px_rgba(255,255,255,0.5)]" />
              </div>
            ) : (
              <div className="flex flex-col gap-1 items-center">
                <div className="w-1 h-1 bg-black rounded-full" />
                <div className="w-1 h-1 bg-black rounded-full" />
                <div className="w-1 h-1 bg-black rounded-full" />
              </div>
            )}
          </button>
        </div>
      </nav>

      {/* Classic Mobile Dropdown */}
      <div
        className={`fixed inset-0 z-40 xl:hidden transition-all duration-500 ${open ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
      >
        {/* Semi-transparent Backdrop with Blur */}
        <div
          className="absolute inset-0 bg-black/5 backdrop-blur-md"
          onClick={() => setOpen(false)}
        />

        {/* Dropdown Panel - Slides from Top */}
        <div className={`absolute top-16 left-0 w-full bg-white border-b border-black/5 shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-y-0' : '-translate-y-full'}`}>
          <div className="flex flex-col p-6 gap-4">
            <span className="text-[9px] font-bold tracking-[0.2em] text-black/30 uppercase border-b border-black/5 pb-2 mb-2">
              Menu
            </span>

            <div className="flex flex-col gap-5">
              {navLinks.filter(link => link.label !== "Contact").map((link) => (
                <a
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="text-sm font-bold uppercase tracking-widest text-black hover:text-black/40 transition-colors"
                >
                  {link.label}
                </a>
              ))}

              {settings.showContact && (
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="mt-4 bg-black text-white px-6 py-4 rounded-xl font-bold uppercase tracking-widest text-[11px] text-center shadow-lg shadow-black/20 active:scale-95 transition-all"
                >
                  Start Your Project
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
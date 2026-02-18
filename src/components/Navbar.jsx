import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { useSite } from "../context/SiteContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const { settings } = useSite();
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Toggle body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
  }, [open]);

  const navLinks = [
    { label: "Home", href: "/", isExternal: true, show: true },
    { label: "About Us", href: isHomePage ? "#about" : "/#about", show: settings.showAbout },
    { label: "Our Vision", href: isHomePage ? "#vision" : "/#vision", show: settings.showVision },
    { label: "Our Expertise", href: isHomePage ? "#expertise" : "/#expertise", show: settings.showExpertise },
    { label: "Our Approach", href: isHomePage ? "#approach" : "/#approach", show: settings.showApproach },
    { label: "Our Services", href: isHomePage ? "#detailed-services" : "/#detailed-services", show: settings.showServices },
    { label: "Why Choose Us", href: isHomePage ? "#why-choose-us" : "/#why-choose-us", show: settings.showWhyChooseUs },
    { label: "Our Work", href: isHomePage ? "#projects" : "/#projects", show: settings.showProjects },
    { label: "Gallery", href: "/gallery", isExternal: true, show: settings.showGallery },
    { label: "Contact", href: isHomePage ? "#contact" : "/#contact", show: settings.showContact },
  ].filter(link => link.show);

  const scrollToTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  const LinkComponent = ({ link, className, children, onClick }) => {
    const handleClick = (e) => {
      if (link.label === "Home") scrollToTop();
      onClick?.(e);
    };
    if (link.href.startsWith("#") && isHomePage) {
      return <a href={link.href} className={className} onClick={handleClick}>{children}</a>;
    }
    return <Link to={link.href} className={className} onClick={handleClick}>{children}</Link>;
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50">
      {/* Reduced Header Height on Mobile: h-16 vs h-20 */}
      <nav className="relative z-50 bg-white/90 backdrop-blur-md border-b border-black/5 h-16 xl:h-20 flex items-center transition-all px-6 xl:px-12 2xl:px-24">
        <div className="max-w-[1440px] mx-auto w-full flex items-center justify-between gap-2 xl:gap-8">
          {/* Logo - nudged slightly down on mobile only for better placement */}
          <Link to="/" onClick={scrollToTop} className="flex-shrink-0 font-montserrat text-lg xl:text-xl tracking-[0.1em] 2xl:tracking-[0.2em] font-light uppercase whitespace-nowrap pt-2 xl:pt-0">
            <span className="text-[#808000]">Z'IONIC</span> <span className="font-bold">ARC</span>
          </Link>

          {/* Desktop Nav Links - compact so all links (incl. Gallery) fit on one line when all sections enabled */}
          <div className="hidden xl:flex flex-1 min-w-0 justify-start pr-6 2xl:pr-8">
            <ul className="flex flex-nowrap items-center gap-x-2 2xl:gap-x-4 font-outfit text-[9px] 2xl:text-[11px] font-medium uppercase tracking-[0.05em] 2xl:tracking-[0.1em] text-black">
              {navLinks.filter(link => link.label !== "Contact").map((link) => (
                <li key={link.label} className="flex-shrink-0">
                  <LinkComponent link={link} className="hover:text-black/40 transition-colors whitespace-nowrap">
                    {link.label}
                  </LinkComponent>
                </li>
              ))}
            </ul>
          </div>

          {/* Desktop CTA - always right; clear gap from last link */}
          <div className="hidden xl:flex items-center flex-shrink-0">
            {settings.showContact && (
              <LinkComponent
                link={{ href: isHomePage ? "#contact" : "/#contact" }}
                className="bg-black text-white px-3 py-2 2xl:px-7 2xl:py-3.5 rounded-full font-outfit text-[9px] 2xl:text-[11px] font-bold uppercase tracking-widest transition-all hover:bg-black/80 hover:scale-105 active:scale-95 shadow-xl shadow-black/10 whitespace-nowrap"
              >
                Start Your Project
              </LinkComponent>
            )}
          </div>

          {/* Mobile: circular black close (X) when open, hamburger when closed */}
          <button
            className={`xl:hidden flex items-center justify-center transition-all duration-300 active:scale-90 z-[60] ${open ? 'w-10 h-10 bg-black rounded-full shadow-lg' : 'w-8 h-8 bg-transparent'
              }`}
            onClick={() => setOpen(!open)}
            aria-label={open ? 'Close menu' : 'Open menu'}
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

        {/* Dropdown Panel - matches reference: thin separator, MENU label, then link list (incl. Contact) */}
        <div className={`absolute top-16 left-0 w-full bg-white shadow-xl transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] ${open ? 'translate-y-0' : '-translate-y-full'}`}>
          {/* Thin grey line separating header from menu items */}
          <div className="h-px bg-black/5 w-full" aria-hidden="true" />
          <div className="flex flex-col px-6 pt-4 pb-6">
            <span className="text-[9px] font-bold tracking-[0.2em] text-black/40 uppercase">
              Menu
            </span>
            <div className="border-t border-black/5 mt-1.5 mb-0.5 w-full" aria-hidden="true" />

            <nav className="flex flex-col gap-0 pt-2 leading-none">
              {navLinks.map((link) => (
                <LinkComponent
                  key={link.label}
                  link={link}
                  onClick={() => setOpen(false)}
                  className="block text-[11px] font-bold uppercase tracking-widest text-black hover:text-black/50 transition-colors py-0 my-0 leading-none"
                >
                  {link.label}
                </LinkComponent>
              ))}
            </nav>
          </div>
        </div>
      </div>
    </header>
  );
}
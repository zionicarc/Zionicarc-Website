import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { handleEmailClick } from '../utils/emailUtils';

export default function Footer({ onOpenTerms, onOpenPrivacy }) {
  const currentYear = new Date().getFullYear();

  const links = [
    { label: "Home", href: "#" },
    { label: "About Us", href: "#about" },
    { label: "Our Expertise", href: "#services" },
    { label: "Our Approach", href: "#approach" },
    { label: "Our Services", href: "#detailed-services" },
    { label: "Why Choose Us", href: "#why-choose-us" },
    // { label: "Our Work", href: "#projects" },
    { label: "Start a Project", href: "#contact" },
  ];

  return (
    <footer className="bg-black text-white py-10 md:py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Identity */}
          <div className="space-y-6">
            <a href="#" className="font-montserrat text-xl tracking-[0.3em] font-normal uppercase">
              Z'IONIC <span className="font-bold">ARC</span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-normal">
              Redefining contemporary architecture through visionary design, structural integrity, and sustainable innovation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-6 md:mb-8">Navigation</h4>
            <ul className="grid grid-cols-1 gap-4">
              {links.map((link) => (
                <li key={link.label}>
                  <a
                    href={link.href}
                    className="text-gray-400 hover:text-white transition-colors text-sm font-normal uppercase tracking-widest"
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-6 md:space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-6 md:mb-8">Connect</h4>

            <div className="space-y-6">
              <a
                href="mailto:zionicarc@gmail.com"
                onClick={handleEmailClick}
                className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/20 transition-all">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-normal">zionicarc@gmail.com</span>
              </a>

              <a href="tel:+919986598000" className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors">
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/20 transition-all">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-normal">+91 9986598000</span>
              </a>

              <a href="https://wa.me/919986598000" target="_blank" rel="noopener noreferrer" className="group flex items-center gap-4 text-[#25D366] hover:text-[#25D366]/80 transition-colors">
                <div className="w-10 h-10 rounded-full border border-[#25D366]/20 flex items-center justify-center bg-[#25D366]/5 group-hover:bg-[#25D366]/10 transition-all">
                  <MessageCircle size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-normal">WhatsApp Chat</span>
              </a>
            </div>
          </div>

          {/* Timings & Statement */}
          <div className="space-y-8">
            <h4 className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/30 mb-8">Studio Hours</h4>
            <div className="space-y-4">
              <p className="text-gray-400 text-sm font-normal">
                Call Timings: <br />
                <span className="text-white">9:00 AM – 5:00 PM</span>
              </p>
              <p className="text-gray-500 text-xs italic font-normal leading-relaxed pt-4 border-t border-white/5">
                "Architecture should speak of its time and place, but yearn for timelessness."
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 md:mt-20 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-normal">
            &copy; {currentYear} Z'IONIC ARC. All Rights Reserved.
            <span className="mx-4 opacity-20">|</span>
            Designed by <a href="https://ruahverse.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">Ruah Verse</a>
          </p>
          <div className="flex gap-8">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                onOpenPrivacy();
              }}
              className="text-[10px] text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors font-normal"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                onOpenTerms();
              }}
              className="text-[10px] text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors font-normal"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

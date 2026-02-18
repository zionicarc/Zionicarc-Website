import React from 'react';
import { Mail, Phone, MessageCircle } from 'lucide-react';
import { handleEmailClick } from '../utils/emailUtils';
import { useSite } from '../context/SiteContext';

export default function Footer({ onOpenTerms, onOpenPrivacy }) {
  const currentYear = new Date().getFullYear();
  const { settings } = useSite();

  const links = [
    { label: "Home", href: "#", show: true },
    { label: "About Us", href: "#about", show: settings.showAbout },
    { label: "Our Expertise", href: "#expertise", show: settings.showExpertise },
    { label: "Our Approach", href: "#approach", show: settings.showApproach },
    { label: "Our Services", href: "#detailed-services", show: settings.showServices },
    { label: "Why Choose Us", href: "#why-choose-us", show: settings.showWhyChooseUs },
    { label: "Our Work", href: "#projects", show: settings.showProjects },
    { label: "Gallery", href: "#gallery", show: settings.showGallery },
    { label: "Start a Project", href: "#contact", show: settings.showContact },
  ].filter(link => link.show);

  return (
    <footer className="bg-black text-white py-10 md:py-20 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">

          {/* Brand Identity */}
          <div className="space-y-6">
            <a href="#" className="font-montserrat text-xl tracking-[0.3em] font-normal uppercase">
              <span className="text-[#808000]">{settings.footer.brandName.split(' ')[0]}</span> <span className="font-bold">{settings.footer.brandName.split(' ').slice(1).join(' ')}</span>
            </a>
            <p className="text-gray-500 text-sm leading-relaxed max-w-xs font-normal">
              {settings.footer.tagline}
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
                href={`mailto:${settings.contact.email}`}
                onClick={handleEmailClick}
                className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/20 transition-all">
                  <Mail size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-normal">{settings.contact.email}</span>
              </a>

              <a
                href={`tel:${settings.contact.phone.replace(/\s+/g, '')}`}
                onClick={(e) => handlePhoneClick(e, settings.contact.phone.replace(/\s+/g, ''))}
                className="group flex items-center gap-4 text-gray-400 hover:text-white transition-colors"
              >
                <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:bg-white/5 group-hover:border-white/20 transition-all">
                  <Phone size={18} strokeWidth={1.5} />
                </div>
                <span className="text-sm font-normal">{settings.contact.phone}</span>
              </a>

              <a
                href={`https://wa.me/${settings.contact.whatsapp}`}
                onClick={(e) => handleWhatsAppClick(e, settings.contact.whatsapp)}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-4 text-[#25D366] hover:text-[#25D366]/80 transition-colors"
              >
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
                {settings.footer.timings}
              </p>
              <p className="text-gray-500 text-xs italic font-normal leading-relaxed pt-4 border-t border-white/5">
                "{settings.footer.quote}"
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 md:mt-20 pt-8 border-t border-white/5 flex flex-col xl:flex-row justify-between items-center gap-6">
          <p className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-normal text-center xl:text-left">
            &copy; {currentYear} {settings.footer.brandName}. {settings.footer.copyright}
            <span className="mx-4 opacity-20 hidden xl:inline">|</span>
            <br className="xl:hidden" />
            <span className="whitespace-nowrap">Designed by <a href={settings.footer.developerLink} target="_blank" rel="noopener noreferrer" className="text-white hover:text-gray-300 transition-colors">{settings.footer.developerName}</a></span>
          </p>
          <div className="flex gap-8">
            <a
              href="#privacy"
              onClick={(e) => {
                e.preventDefault();
                onOpenPrivacy();
              }}
              className="text-[10px] text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors font-normal whitespace-nowrap"
            >
              Privacy Policy
            </a>
            <a
              href="#terms"
              onClick={(e) => {
                e.preventDefault();
                onOpenTerms();
              }}
              className="text-[10px] text-gray-500 uppercase tracking-[0.2em] hover:text-white transition-colors font-normal whitespace-nowrap"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

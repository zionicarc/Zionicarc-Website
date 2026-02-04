import React from 'react';
import { Mail, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { handleEmailClick, handleWhatsAppClick } from '../utils/emailUtils';

export default function Contact() {
  return (
    <section id="contact" className="py-24 bg-white text-black border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Header Content */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] mb-8">
              Start a Project
            </h2>
            <p className="text-gray-600 text-lg font-normal max-w-md mb-10 leading-relaxed">
              We are ready to transform your architectural vision into reality.
              Connect with our studio directly through the channels below.
            </p>

            <div className="inline-flex items-center gap-2 md:gap-3 px-4 md:px-5 py-2 md:py-3 bg-[#f9f9f9] rounded-xl md:rounded-2xl border border-black/5 mt-2 transition-all">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-black rounded-full animate-pulse shrink-0" />
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-widest text-black/60 whitespace-nowrap">
                Call Timings: 9:00 AM – 5:00 PM
              </p>
            </div>
          </div>

          {/* Contact Methods Grid */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-4">

            {/* WhatsApp - Priority Action */}
            <a
              href="https://wa.me/919986598000"
              onClick={(e) => handleWhatsAppClick(e, '919986598000')}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative flex items-center justify-between p-5 md:p-8 bg-[#25D366]/5 border border-[#25D366]/20 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 hover:bg-[#25D366]/10"
            >
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-[#25D366] rounded-xl md:rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 group-hover:scale-110 shrink-0">
                  <MessageCircle className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-[#128C7E] mb-0.5 md:mb-1">WhatsApp</span>
                  <span className="text-base md:text-2xl font-normal text-black block truncate md:overflow-visible tracking-tight">+91 9986598000</span>
                </div>
              </div>
              <ArrowUpRight className="text-[#25D366] opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shrink-0 hidden sm:block" size={24} />
            </a>

            {/* Email Method */}
            <a
              href="mailto:zionicarc@gmail.com"
              onClick={handleEmailClick}
              className="group relative flex items-center justify-between p-5 md:p-8 bg-gray-50 border border-black/5 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 hover:bg-black hover:text-white"
            >
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white border border-black/5 rounded-xl md:rounded-2xl flex items-center justify-center text-black transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20 shrink-0">
                  <Mail className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-white/50 mb-0.5 md:mb-1">Email Address</span>
                  <span className="text-base md:text-2xl font-normal block truncate md:overflow-visible tracking-tight">zionicarc@gmail.com</span>
                </div>
              </div>
              <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shrink-0 hidden sm:block" size={24} />
            </a>

            {/* Phone Method */}
            <a
              href="tel:+919986598000"
              onClick={(e) => handlePhoneClick(e, '+919986598000')}
              className="group relative flex items-center justify-between p-5 md:p-8 bg-gray-50 border border-black/5 rounded-[2rem] md:rounded-[2.5rem] transition-all duration-300 hover:bg-black hover:text-white"
            >
              <div className="flex items-center gap-4 md:gap-6 min-w-0">
                <div className="w-12 h-12 md:w-14 md:h-14 bg-white border border-black/5 rounded-xl md:rounded-2xl flex items-center justify-center text-black transition-all duration-300 group-hover:scale-110 group-hover:bg-white/10 group-hover:text-white group-hover:border-white/20 shrink-0">
                  <Phone className="w-6 h-6 md:w-7 md:h-7" strokeWidth={1.5} />
                </div>
                <div className="min-w-0">
                  <span className="block text-[9px] md:text-[10px] font-bold uppercase tracking-[0.2em] text-gray-400 group-hover:text-white/50 mb-0.5 md:mb-1">Phone Line</span>
                  <span className="text-base md:text-2xl font-normal block truncate md:overflow-visible tracking-tight">+91 9986598000</span>
                </div>
              </div>
              <ArrowUpRight className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 shrink-0 hidden sm:block" size={24} />
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}

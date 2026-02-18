import React from 'react';
import { Mail, Phone, MessageCircle, ArrowUpRight } from 'lucide-react';
import { handleEmailClick, handleWhatsAppClick, handlePhoneClick } from '../utils/emailUtils';
import { useSite } from '../context/SiteContext';

export default function Contact() {
  const { settings } = useSite();
  const data = settings.contact;
  return (
    <section id="contact" className="py-24 bg-white text-black border-t border-black/5">
      <div className="max-w-7xl mx-auto px-6 md:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">

          {/* Header Content */}
          <div className="lg:col-span-5">
            <h2 className="text-3xl md:text-5xl font-outfit font-light tracking-tighter text-black leading-[0.9] mb-10">
              {data.title}
            </h2>
            <p className="text-gray-600 text-lg md:text-xl font-normal max-w-md mb-12 leading-relaxed">
              {data.description}
            </p>

            <div className="inline-flex items-center gap-2 md:gap-3 px-6 py-3 bg-[#f9f9f9] rounded-2xl border border-black/5 mt-2 transition-all">
              <div className="w-2 h-2 bg-black/40 rounded-full shrink-0" />
              <p className="text-[10px] md:text-xs font-bold uppercase tracking-[0.1em] md:tracking-[0.25em] text-black/60">
                {settings.footer.timings}
              </p>
            </div>
          </div>

          {/* Contact Methods Grid */}
          <div className="lg:col-span-6 lg:col-start-7 flex flex-col gap-6">

            {/* WhatsApp Card */}
            <a
              href={`https://wa.me/${data.whatsapp}`}
              onClick={(e) => handleWhatsAppClick(e, data.whatsapp)}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-center p-5 md:p-8 bg-white border border-[#25D366]/20 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-300 hover:shadow-xl hover:shadow-[#25D366]/5 hover:-translate-y-1"
            >
              <div className="flex items-center gap-5 md:gap-8 w-full">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-[#25D366] rounded-2xl flex items-center justify-center text-white shadow-lg shadow-[#25D366]/20 transition-all duration-300 group-hover:scale-110 shrink-0">
                  <MessageCircle className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-[#25D366]">WhatsApp</span>
                  <span className="text-xl md:text-3xl font-normal text-black tracking-tight">+{data.phone}</span>
                </div>
              </div>
            </a>

            {/* Email Card */}
            <a
              href={`mailto:${data.email}`}
              onClick={handleEmailClick}
              className="group flex items-center p-5 md:p-8 bg-white border border-black/5 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
            >
              <div className="flex items-center gap-5 md:gap-8 w-full overflow-hidden">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-black shadow-sm transition-all duration-300 group-hover:scale-110 shrink-0">
                  <Mail className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Email Address</span>
                  <span className="text-base md:text-3xl font-normal text-black tracking-tight break-all">{data.email}</span>
                </div>
              </div>
            </a>

            {/* Phone Card */}
            <a
              href={`tel:${data.phone.replace(/\s+/g, '')}`}
              onClick={(e) => handlePhoneClick(e, data.phone.replace(/\s+/g, ''))}
              className="group flex items-center p-5 md:p-8 bg-white border border-black/5 rounded-[2.5rem] md:rounded-[3rem] transition-all duration-300 hover:shadow-xl hover:shadow-black/5 hover:-translate-y-1"
            >
              <div className="flex items-center gap-5 md:gap-8 w-full">
                <div className="w-14 h-14 md:w-16 md:h-16 bg-white border border-black/5 rounded-2xl flex items-center justify-center text-black shadow-sm transition-all duration-300 group-hover:scale-110 shrink-0">
                  <Phone className="w-8 h-8" strokeWidth={1.5} />
                </div>
                <div className="flex flex-col gap-1 overflow-hidden">
                  <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[0.2em] text-gray-400">Phone Line</span>
                  <span className="text-xl md:text-3xl font-normal text-black tracking-tight whitespace-nowrap overflow-ellipsis">{data.phone}</span>
                </div>
              </div>
            </a>

          </div>
        </div>
      </div>
    </section>
  );
}

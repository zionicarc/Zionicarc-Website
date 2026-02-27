import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { handleEmailClick } from '../utils/emailUtils';
import { useSite } from '../context/SiteContext';

const TermsOfService = ({ isOpen, onClose }) => {
    const { settings } = useSite();

    useEffect(() => {
        if (isOpen) {
            gsap.to('.terms-overlay', { opacity: 1, duration: 0.5, display: 'flex' });
            gsap.fromTo('.terms-content',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
            );
            document.body.style.overflow = 'hidden';
        } else {
            gsap.to('.terms-overlay', {
                opacity: 0,
                duration: 0.4,
                display: 'none',
                onComplete: () => {
                    document.body.style.overflow = 'unset';
                }
            });
        }
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="terms-overlay fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12 opacity-0 hidden">
            <div className="terms-content relative w-full max-w-4xl max-h-[85vh] bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-neutral-900 z-10">
                    <div>
                        <h2 className="text-2xl font-montserrat tracking-[0.2em] uppercase text-white">Terms of <span className="font-bold text-white">Service</span></h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Last Updated: {settings.termsOfService?.lastUpdated || 'December 2025'}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-black rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90 hover:bg-black/80"
                        aria-label="Close Terms of Service"
                    >
                        <div className="relative w-5 h-5 flex items-center justify-center">
                            <div className="absolute w-[18px] h-[2.5px] bg-white rounded-full rotate-45 shadow-[0_0_2px_rgba(255,255,255,0.5)]" />
                            <div className="absolute w-[18px] h-[2.5px] bg-white rounded-full -rotate-45 shadow-[0_0_2px_rgba(255,255,255,0.5)]" />
                        </div>
                    </button>
                </div>

                {/* Content */}
                <div className="p-6 md:p-8 overflow-y-auto custom-scrollbar space-y-4">
                    {settings.termsOfService?.sections?.map((section, index) => (
                        <div key={index} className="space-y-1">
                            <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">{section.title}</h3>
                            <div className="space-y-2">
                                <p className="text-gray-400 text-sm leading-relaxed font-normal">
                                    {section.content}
                                </p>
                                {section.listItems && section.listItems.length > 0 && (
                                    <ul className="text-gray-400 text-sm space-y-0.5 pl-2">
                                        {section.listItems.map((item, idx) => (
                                            <li key={idx} className="leading-relaxed font-normal">{item}</li>
                                        ))}
                                    </ul>
                                )}
                                {section.secondaryContent && (
                                    <p className="text-gray-400 text-sm leading-relaxed font-normal">
                                        {section.secondaryContent}
                                    </p>
                                )}
                            </div>
                        </div>
                    ))}


                </div>
            </div>
        </div>
    );
};

export default TermsOfService;

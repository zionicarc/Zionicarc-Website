import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { handleEmailClick } from '../utils/emailUtils';

const TermsOfService = ({ isOpen, onClose }) => {
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
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Last Updated: December 2025</p>
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
                <div className="p-8 md:p-12 overflow-y-auto custom-scrollbar space-y-4">
                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">1. Agreement to Terms</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            By accessing or using <span className="text-white font-medium">Z'IONIC ARC</span>, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, do not use this Website.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">2. Use of the Website</h3>
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">
                                a. You agree to use the Website only for lawful purposes.
                            </p>
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">
                                b. You shall not upload, post, transmit, or otherwise make available any content that violates third-party rights.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">3. Intellectual Property</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            All content on this Website (text, graphics, logos, images) is the property of the Website owner or its licensors and is protected by applicable copyright, trademark, and other intellectual property laws.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">4. User Content</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            If you submit content to the Website (comments, feedback), you grant the Website a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and distribute that content.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">5. Limitation of Liability</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal italic">
                            The Website and all information are provided "as is," without warranty of any kind. The owner will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access or use of the Website.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">6. Links to Third-Party Sites</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            The Website may contain links to third-party websites. These links are provided for convenience only. The owner does not control and is not responsible for the content of third-party sites.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">7. Governing Law</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            These Terms will be governed by and construed in accordance with the laws of <span className="text-white font-medium">India</span> without regard to conflict of law provisions.
                        </p>
                    </section>

                    <section className="space-y-2">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">8. Changes to Terms</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            The Website may revise these Terms at any time. Your continued use of the Website constitutes acceptance of the revised Terms.
                        </p>
                    </section>

                    <section className="space-y-6 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">9. Contact Information</h3>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                            <p className="text-gray-400 text-sm font-normal">For questions about these Terms, contact:</p>
                            <a
                                href="mailto:zionicarc@gmail.com"
                                onClick={handleEmailClick}
                                className="text-white hover:text-gray-300 transition-colors mt-2 block font-medium"
                            >
                                zionicarc@gmail.com
                            </a>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
};

export default TermsOfService;

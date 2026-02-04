import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import gsap from 'gsap';
import { handleEmailClick } from '../utils/emailUtils';

const PrivacyPolicy = ({ isOpen, onClose }) => {
    useEffect(() => {
        if (isOpen) {
            gsap.to('.privacy-overlay', { opacity: 1, duration: 0.5, display: 'flex' });
            gsap.fromTo('.privacy-content',
                { y: 50, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.6, ease: 'power3.out', delay: 0.2 }
            );
            document.body.style.overflow = 'hidden';
        } else {
            gsap.to('.privacy-overlay', {
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
        <div className="privacy-overlay fixed inset-0 z-[100] bg-black/95 backdrop-blur-xl flex items-center justify-center p-6 md:p-12 opacity-0 hidden">
            <div className="privacy-content relative w-full max-w-4xl max-h-[85vh] bg-neutral-900 border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
                {/* Header */}
                <div className="p-8 border-b border-white/5 flex justify-between items-center sticky top-0 bg-neutral-900 z-10">
                    <div>
                        <h2 className="text-2xl font-montserrat tracking-[0.2em] uppercase text-white">Privacy <span className="font-bold text-white">Policy</span></h2>
                        <p className="text-gray-500 text-[10px] uppercase tracking-widest mt-2">Last Updated: December 2025</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-10 h-10 bg-black rounded-2xl shadow-lg flex items-center justify-center transition-all duration-300 active:scale-90 hover:bg-black/80"
                        aria-label="Close Privacy Policy"
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
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">1. Introduction</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            Your privacy is important to us. This Privacy Policy explains how <span className="text-white">https://zionic-arc-website.vercel.app</span> ("we," "us," "our," or the "Website") collects, uses, and protects your personal information when you visit or interact with our Website.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">2. Information We Collect</h3>
                        <div className="space-y-2">
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">
                                We may collect personal information that you voluntarily provide to us, including but not limited to:
                            </p>
                            <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 pl-2">
                                <li>Name</li>
                                <li>Email address</li>
                                <li>Contact information</li>
                            </ul>
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">
                                We may also automatically collect certain non-personal information such as browser type, IP address, device information, and pages visited through cookies and analytics tools.
                            </p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">3. Use of Your Information</h3>
                        <div className="space-y-3">
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">We use the information we collect to:</p>
                            <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 pl-2">
                                <li>Provide, operate, and improve the Website</li>
                                <li>Respond to inquiries and communications</li>
                                <li>Send updates or marketing communications, where you have opted in</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">4. Cookies and Tracking Technologies</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            We use cookies and similar tracking technologies to analyze Website usage and enhance user experience. You may control or disable cookies through your browser settings; however, some features of the Website may not function properly if cookies are disabled.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">5. Information Sharing</h3>
                        <div className="space-y-3">
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:</p>
                            <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 pl-2">
                                <li>To comply with legal obligations</li>
                                <li>To protect our rights, property, or safety</li>
                                <li>With trusted service providers who assist in operating the Website, subject to confidentiality obligations</li>
                            </ul>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">6. Data Security</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of data transmission or storage is completely secure.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">7. Your Rights</h3>
                        <div className="space-y-3">
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">Depending on applicable laws and your jurisdiction, you may have the right to:</p>
                            <ul className="list-disc list-inside text-gray-400 text-sm space-y-2 pl-2">
                                <li>Access, update, or delete your personal information</li>
                                <li>Restrict or object to certain processing activities</li>
                                <li>Withdraw consent where processing is based on consent</li>
                            </ul>
                            <p className="text-gray-400 text-sm leading-relaxed font-normal">To exercise these rights, please contact us using the details below.</p>
                        </div>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">8. Children’s Privacy</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            This Website is not intended for children under the age of 16. We do not knowingly collect personal information from children. If you believe that such information has been collected, please contact us so it can be promptly removed.
                        </p>
                    </section>

                    <section className="space-y-4">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">9. Changes to This Privacy Policy</h3>
                        <p className="text-gray-400 text-sm leading-relaxed font-normal">
                            We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of the Website after changes are made constitutes acceptance of the revised policy.
                        </p>
                    </section>

                    <section className="space-y-6 pt-6 border-t border-white/5">
                        <h3 className="text-sm font-bold uppercase tracking-widest text-white border-l-2 border-white/20 pl-4">10. Contact Us</h3>
                        <div className="bg-white/5 p-6 rounded-xl border border-white/5">
                            <p className="text-gray-400 text-sm font-normal">If you have any questions or concerns about this Privacy Policy, please contact us at:</p>
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

export default PrivacyPolicy;

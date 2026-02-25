import React, { createContext, useContext, useState, useEffect } from 'react';
import { db } from '../lib/firebase';
import { doc, onSnapshot, setDoc } from 'firebase/firestore';

const SiteContext = createContext();

const deepMerge = (target, source) => {
    for (const key in source) {
        if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
            if (!target[key]) target[key] = {};
            deepMerge(target[key], source[key]);
        } else {
            target[key] = source[key];
        }
    }
    return target;
};

export const SiteProvider = ({ children }) => {
    const defaultSettings = {
        showAbout: true,
        showVision: true,
        showExpertise: true,
        showApproach: true,
        showServices: true,
        showProjects: true,
        showGallery: true,
        showWhyChooseUs: true,
        showContact: true,
        gallery: {
            title: "Gallery",
            description: "Curated moments from our portfolio.",
            sections: [
                {
                    title: "Residential Projects",
                    images: [
                        { url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop", title: "Modern Villa" },
                        { url: "https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?q=80&w=2070&auto=format&fit=crop", title: "Contemporary Kitchen" }
                    ]
                },
                {
                    title: "Commercial Spaces",
                    images: [
                        { url: "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=2069&auto=format&fit=crop", title: "Tech Office" },
                        { url: "https://images.unsplash.com/photo-1497366811353-6870744d04b2?q=80&w=2069&auto=format&fit=crop", title: "Lounge Area" }
                    ]
                }
            ]
        },
        hero: {
            title: "Z'IONIC ARC",
            tagline: "Redefine the skyline. We craft spaces that merge human experience with distinct architectural geometry.",
            primaryBtn: "Our Services",
            secondaryBtn: "Contact Us"
        },
        about: {
            title: "About Us",
            content: "An architecture and design firm specialized in creating innovative, functional, and aesthetically pleasing spaces across residential, commercial, and hospitality sectors. Each project is a unique reflection of our clients' vision, values and aspirations, thoughtfully translated into meaningful design with precision, care and creativity."
        },
        vision: {
            title: "Our Vision",
            description: "Our vision is to serve as faithful stewards of creation, designing spaces that align with God’s purpose, reflect His Kingdom on Earth, and restore harmony between humanity and nature.\n\nThrough sustainable, climate-responsive architecture, we seek to protect, heal, and regenerate the environment, honoring the land, respecting existing ecosystems, and enabling both people and nature to flourish in their fullest potential."
        },
        expertise: {
            title: "Our Expertise",
            caption: "We deliver comprehensive design solutions that respect context, geography, and culture.",
            items: [
                { desc: "Strong conceptual thinking with practical design solutions", icon: "Lightbulb" },
                { desc: "Manage constraints like budget, site, time, regulations with positive solution driven mindset.", icon: "Settings" },
                { desc: "Long term partnership through trust, transparency and collaboration.", icon: "Users" },
                { desc: "To consistently exceed expectations through quality, excellence, wisdom understanding, knowledge and attention to detail.", icon: "CheckCircle" }
            ]
        },
        approach: {
            title: "Our Approach",
            description: "Our approach to design is experimental and sculptural. We begin with free hand sketches allowing forms to evolve intuitively and then refine them using technology.",
            steps: [
                { title: "Fragmentation", desc: "At Z'IONIC ARC, we break our design into layered intersecting volumes allowing multiple perspectives and experiences instead of a single rigid form." },
                { title: "Sustainability", desc: "Our commitment to sustainable materials is rooted in understanding that every choice we make and should support human health, advance social equity, protect ecosystems, mitigate climate impact and contribute to a circular economy." },
                { title: "Challenging Perception", desc: "Architecture as a form of research , cultural critique and humanity service to uplift communities , empower businesses and to create lasting value rather than a commercial service." }
            ]
        },
        services: {
            title: "Our Services",
            caption: "From bold architectural concepts to refined interiors Z'IONIC ARC delivers end to end solutions.",
            items: [
                { title: "Residential Architecture", desc: "Our residential architecture expertise transforms spaces into exceptional homes that balance aesthetics and functionality.", img: "" },
                { title: "Interior Design", desc: "We deliver personalized interior design and build services; complete refurbishments, extensions, existing space conversions and top notch renovations.", img: "" },
                { title: "Institutional Architecture", desc: "We specialize in designing institutional buildings that inspire learning, collaboration, and community engagement.", img: "" },
                { title: "Commercial Architecture", desc: "We create spaces that transform employee well-being, boost productivity, and represent your brand’s personality.", img: "" },
                { title: "Construction Monitoring", desc: "Regular site visits and progress reports to verify contractor performance and quality.", img: "" },
                { title: "Fellowship and Mentorship", desc: "Z'IONIC ARC is committed to building an inclusive and equitable workplace by investing in programs that support mentorship.", img: "https://unsplash.com/photos/TltGIe9PK4Y/download?force=true&w=2070" }
            ]
        },
        whyChooseUs: {
            title: "Why Choose Us",
            description: "A decade of architectural excellence shaped by experience, collaboration, and clarity of vision.",
            items: [
                { title: "Experience", description: "With over 10 years of experience in the industry, Z'IONIC ARC has a proven track record of delivering high-quality, innovative designs.", icon: "Award" },
                { title: "Expert Team", description: "Our team of skilled architects, designers, and project managers are passionate about creating spaces that inspire and impress.", icon: "Users" },
                { title: "Customized Solutions", description: "Every project is unique. Our customized design solutions are tailored to meet the specific needs and preferences of each client.", icon: "Settings" }
            ]
        },
        contact: {
            title: "Start a Project",
            description: "We are ready to transform your architectural vision into reality. Connect with our studio directly through the channels below.",
            email: "zionicarc@gmail.com",
            phone: "+91 9986598000",
            whatsapp: "919986598000"
        },
        projects: {
            title: "Our Work",
            caption: "View all our projects.",
            items: [
                { title: "Aeon Tower", category: "Commercial", platform: "Web", year: "2024", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop", link: "#" },
                { title: "The Glass House", category: "Residential", platform: "Web", year: "2024", img: "https://images.unsplash.com/photo-1449156059431-787c1be17d0b?q=80&w=2070&auto=format&fit=crop", link: "#" },
                { title: "Skyline Pavilion", category: "Public Design", platform: "Web", year: "2024", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop", link: "#" },
                { title: "Zenith Library", category: "Institutional", platform: "Web", year: "2024", img: "https://images.unsplash.com/photo-1518005020250-6eb5f3f2d057?q=80&w=2086&auto=format&fit=crop", link: "#" }
            ]
        },
        footer: {
            tagline: "Redefining contemporary architecture with a fusion of sculptural forms and human experience.",
            timings: "Call Timings: 9:00 AM – 5:00 PM",
            quote: "Architecture should speak of its time and place, but yearn for timelessness.",
            brandName: "Z'IONIC ARC",
            copyright: "All Rights Reserved.",
            developerName: "Ruah Verse",
        },
        privacyPolicy: {
            lastUpdated: "December 2025",
            sections: [
                {
                    title: "1. Introduction",
                    content: "Your privacy is important to us. This Privacy Policy explains how https://zionic-arc-website.vercel.app (\"we,\" \"us,\" \"our,\" or the \"Website\") collects, uses, and protects your personal information when you visit or interact with our Website."
                },
                {
                    title: "2. Information We Collect",
                    content: "We may collect personal information that you voluntarily provide to us, including but not limited to:",
                    listItems: ["Name", "Email address", "Contact information"],
                    secondaryContent: "We may also automatically collect certain non-personal information such as browser type, IP address, device information, and pages visited through cookies and analytics tools."
                },
                {
                    title: "3. Use of Your Information",
                    content: "We use the information we collect to:",
                    listItems: [
                        "Provide, operate, and improve the Website",
                        "Respond to inquiries and communications",
                        "Send updates or marketing communications, where you have opted in"
                    ]
                },
                {
                    title: "4. Cookies and Tracking Technologies",
                    content: "We use cookies and similar tracking technologies to analyze Website usage and enhance user experience. You may control or disable cookies through your browser settings; however, some features of the Website may not function properly if cookies are disabled."
                },
                {
                    title: "5. Information Sharing",
                    content: "We do not sell, trade, or rent your personal information to third parties. We may share information only in the following circumstances:",
                    listItems: [
                        "To comply with legal obligations",
                        "To protect our rights, property, or safety",
                        "With trusted service providers who assist in operating the Website, subject to confidentiality obligations"
                    ]
                },
                {
                    title: "6. Data Security",
                    content: "We implement reasonable technical and organizational measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of data transmission or storage is completely secure."
                },
                {
                    title: "7. Your Rights",
                    content: "Depending on applicable laws and your jurisdiction, you may have the right to:",
                    listItems: [
                        "Access, update, or delete your personal information",
                        "Restrict or object to certain processing activities",
                        "Withdraw consent where processing is based on consent"
                    ],
                    secondaryContent: "To exercise these rights, please contact us using the details below."
                },
                {
                    title: "8. Children’s Privacy",
                    content: "This Website is not intended for children under the age of 16. We do not knowingly collect personal information from children. If you believe that such information has been collected, please contact us so it can be promptly removed."
                },
                {
                    title: "9. Changes to This Privacy Policy",
                    content: "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. Continued use of the Website after changes are made constitutes acceptance of the revised policy."
                },
                {
                    title: "10. Contact Us",
                    content: "If you have any questions or concerns about this Privacy Policy, please contact us at:",
                    secondaryContent: "zionicarc@gmail.com"
                }
            ]
        },
        termsOfService: {
            lastUpdated: "December 2025",
            sections: [
                {
                    title: "1. Agreement to Terms",
                    content: "By accessing or using Z'IONIC ARC, you agree to be bound by these Terms and Conditions and all applicable laws and regulations. If you do not agree, do not use this Website."
                },
                {
                    title: "2. Use of the Website",
                    listItems: [
                        "a. You agree to use the Website only for lawful purposes.",
                        "b. You shall not upload, post, transmit, or otherwise make available any content that violates third-party rights."
                    ]
                },
                {
                    title: "3. Intellectual Property",
                    content: "All content on this Website (text, graphics, logos, images) is the property of the Website owner or its licensors and is protected by applicable copyright, trademark, and other intellectual property laws."
                },
                {
                    title: "4. User Content",
                    content: "If you submit content to the Website (comments, feedback), you grant the Website a worldwide, non-exclusive, royalty-free license to use, reproduce, modify, adapt, publish, and distribute that content."
                },
                {
                    title: "5. Limitation of Liability",
                    content: "The Website and all information are provided \"as is,\" without warranty of any kind. The owner will not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your access or use of the Website."
                },
                {
                    title: "6. Links to Third-Party Sites",
                    content: "The Website may contain links to third-party websites. These links are provided for convenience only. The owner does not control and is not responsible for the content of third-party sites."
                },
                {
                    title: "7. Governing Law",
                    content: "These Terms will be governed by and construed in accordance with the laws of India without regard to conflict of law provisions."
                },
                {
                    title: "8. Changes to Terms",
                    content: "The Website may revise these Terms at any time. Your continued use of the Website constitutes acceptance of the revised Terms."
                },
                {
                    title: "9. Privacy Policy",
                    content: "For questions about these Terms, contact: zionicarc@gmail.com"
                }
            ]
        }
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);
    const MIN_LOADING_MS = 2000;

    const finishLoading = (startTime) => {
        const elapsed = Date.now() - startTime;
        const remaining = Math.max(0, MIN_LOADING_MS - elapsed);
        if (remaining > 0) {
            setTimeout(() => setLoading(false), remaining);
        } else {
            setLoading(false);
        }
    };

    useEffect(() => {
        const startTime = Date.now();

        // If Firebase is not configured, use default settings immediately
        if (!db) {
            console.log("Firebase not configured. Using default settings.");
            // Try to load from localStorage as fallback
            const saved = localStorage.getItem('siteSettings');
            if (saved) {
                try {
                    setSettings(deepMerge({ ...defaultSettings }, JSON.parse(saved)));
                } catch (e) {
                    setSettings(defaultSettings);
                }
            } else {
                setSettings(defaultSettings);
            }
            finishLoading(startTime);
            return;
        }

        // Create listener for real-time updates from Firebase
        const unsubscribe = onSnapshot(doc(db, "settings", "global"), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Deep merge incoming data with defaults to avoid breakages during updates
                setSettings(prev => deepMerge({ ...defaultSettings }, data));
            } else {
                console.log("No settings found in Firebase. Initializing with defaults.");
                setSettings(defaultSettings);
            }
            finishLoading(startTime);
        }, (error) => {
            console.warn("Firebase Snapshot Error (possibly missing config):", error);
            // Fallback to local if Firebase fails
            const saved = localStorage.getItem('siteSettings');
            if (saved) {
                try {
                    setSettings(deepMerge({ ...defaultSettings }, JSON.parse(saved)));
                } catch (e) {
                    setSettings(defaultSettings);
                }
            } else {
                setSettings(defaultSettings);
            }
            finishLoading(startTime);
        });

        return () => unsubscribe();
    }, []);

    const updateSettings = async (newSettings) => {
        // If Firebase is not configured, just update local state and localStorage
        if (!db) {
            console.log("Firebase not configured. Updating settings locally only.");
            setSettings(newSettings);
            localStorage.setItem('siteSettings', JSON.stringify(newSettings));
            return;
        }

        try {
            // Write to Firebase - this will trigger the onSnapshot above automatically
            await setDoc(doc(db, "settings", "global"), newSettings);
            // Also keep a local backup
            localStorage.setItem('siteSettings', JSON.stringify(newSettings));
        } catch (error) {
            console.error("Error updating settings in Firebase:", error);
            // If Firebase fails, update local state directly so the UI doesn't freeze
            setSettings(newSettings);
            localStorage.setItem('siteSettings', JSON.stringify(newSettings));
            throw error;
        }
    };

    return (
        <SiteContext.Provider value={{ settings, updateSettings, loading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => useContext(SiteContext);

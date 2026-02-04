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
        showExpertise: true,
        showApproach: true,
        showServices: true,
        showProjects: true,
        showWhyChooseUs: true,
        showContact: true,
        hero: {
            title: "Z'IONIC ARC",
            tagline: "Redefine the skyline. We craft spaces that merge human experience with distinct architectural geometry.",
            primaryBtn: "Our Services",
            secondaryBtn: "Contact Us"
        },
        about: {
            title: "About Us",
            description: "An architecture and design firm specialized in creating innovative, functional, and aesthetically pleasing spaces across residential, commercial, and hospitality sectors. Each project is a unique reflection of our clients' vision, values and aspirations, thoughtfully translated into meaningful design with precision, care and creativity."
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
                { no: "01", title: "Fragmentation", desc: "At Z'IONIC ARC, we break our design into layered intersecting volumes allowing multiple perspectives and experiences instead of a single rigid form." },
                { no: "02", title: "Sustainability", desc: "Our commitment to sustainable materials is rooted in understanding that every choice we make and should support human health, advance social equity, protect ecosystems, mitigate climate impact and contribute to a circular economy." },
                { no: "03", title: "Challenging Perception", desc: "Architecture as a form of research , cultural critique and humanity service to uplift communities , empower businesses and to create lasting value rather than a commercial service." }
            ]
        },
        services: {
            title: "Our Services",
            caption: "From bold architectural concepts to refined interiors Z'IONIC ARC delivers end to end solutions.",
            items: [
                { title: "Residential Architecture", subtitle: "Contemporary and Tailored", desc: "Our residential architecture expertise transforms spaces into exceptional homes that balance aesthetics and functionality." },
                { title: "Interior Design", subtitle: "Luxury, Seamless execution, Price Conscious.", desc: "We deliver personalized interior design and build services; complete refurbishments, extensions, existing space conversions and top notch renovations." },
                { title: "Institutional Architecture", subtitle: "Designing across generations.", desc: "We specialize in designing institutional buildings that inspire learning, collaboration, and community engagement." },
                { title: "Commercial Architecture", subtitle: "Tailored Expertise across every stage.", desc: "We create spaces that transform employee well-being, boost productivity, and represent your brand’s personality." },
                { title: "Construction Monitoring", subtitle: "Precision oversight from foundation to finish.", desc: "Regular site visits and progress reports to verify contractor performance and quality." },
                { title: "Fellowship and Mentorship", subtitle: "Nurturing the next generation of architects.", desc: "Z'IONIC ARC is committed to building an inclusive and equitable workplace by investing in programs that support mentorship." }
            ]
        },
        whyChooseUs: {
            title: "Why Choose Us",
            description: "A decade of architectural excellence shaped by experience, collaboration, and clarity of vision.",
            reasons: [
                { title: "Experience", desc: "With over 10 years of experience in the industry, Z'IONIC ARC has a proven track record of delivering high-quality, innovative designs.", icon: "Award" },
                { title: "Expert Team", desc: "Our team of skilled architects, designers, and project managers are passionate about creating spaces that inspire and impress.", icon: "Users" },
                { title: "Customized Solutions", desc: "Every project is unique. Our customized design solutions are tailored to meet the specific needs and preferences of each client.", icon: "Settings" }
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
            description: "View all our projects.",
            items: [
                { name: "Aeon Tower", location: "Singapore", img: "https://images.unsplash.com/photo-1486325212027-8081e485255e?q=80&w=2670&auto=format&fit=crop", type: "Commercial" },
                { name: "The Glass House", location: "Switzerland", img: "https://images.unsplash.com/photo-1449156059431-787c1be17d0b?q=80&w=2070&auto=format&fit=crop", type: "Residential" },
                { name: "Skyline Pavilion", location: "Tokyo", img: "https://images.unsplash.com/photo-1487958449943-2429e8be8625?q=80&w=2070&auto=format&fit=crop", type: "Public Design" },
                { name: "Zenith Library", location: "Copenhagen", img: "https://images.unsplash.com/photo-1518005020250-6eb5f3f2d057?q=80&w=2086&auto=format&fit=crop", type: "Institutional" }
            ]
        },
        footer: {
            tagline: "Redefining contemporary architecture with a fusion of sculptural forms and human experience.",
            timings: "Call Timings: 9:00 AM – 5:00 PM"
        },
        customSections: []
    };

    const [settings, setSettings] = useState(defaultSettings);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
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
            setLoading(false);
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
            }
            setLoading(false);
        });

        return () => unsubscribe();
    }, []);

    const updateSettings = async (newSettings) => {
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

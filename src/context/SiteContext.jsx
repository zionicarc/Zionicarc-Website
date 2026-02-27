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
                { title: "Fellowship and Mentorship", desc: "Z'IONIC ARC is committed to building an inclusive and equitable workplace by investing in programs that support mentorship.", img: "" }
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
            lastUpdated: "February 27, 2026",
            sections: [
                {
                    title: "1. Introduction",
                    content: "This Privacy Policy describes Our policies and procedures on the collection, use and disclosure of Your information when You use the Service and tells You about Your privacy rights and how the law protects You. We use Your Personal Data to provide and improve the Service. By using the Service, You agree to the collection and use of information in accordance with this Privacy Policy. This Privacy Policy has been created with the help of the TermsFeed Privacy Policy Generator."
                },
                {
                    title: "2. Interpretation and Definitions",
                    content: "The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.",
                    secondaryContent: "For the purposes of this Privacy Policy: Account means a unique account created for You to access our Service or parts of our Service. Affiliate means an entity that controls, is controlled by, or is under common control with a party, where \"control\" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority. Company (referred to as either \"the Company\", \"We\", \"Us\" or \"Our\") refers to Zionic Arc. Cookies are small files placed on Your computer, mobile device or any other device by a website, containing the details of Your browsing history on that website. Country refers to: Karnataka, India. Device means any device that can access the Service such as a computer, a cell phone or a digital tablet. Personal Data (or Personal Information) is any information that relates to an identified or identifiable individual. Service refers to the Website. Service Provider means any natural or legal person who processes the data on behalf of the Company. Usage Data refers to data collected automatically, either generated by the use of the Service or from the Service infrastructure itself (for example, the duration of a page visit). Website refers to Zionic Arc, accessible from https://www.zionicarc.com/. You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable."
                },
                {
                    title: "3. Types of Data Collected",
                    content: "While using Our Service, We may ask You to provide Us with certain personally identifiable information that can be used to contact or identify You. Personally identifiable information may include, but is not limited to: Email address, Phone number.",
                    secondaryContent: "Usage Data is collected automatically when using the Service. Usage Data may include information such as Your Device's Internet Protocol address (e.g. IP address), browser type, browser version, the pages of our Service that You visit, the time and date of Your visit, the time spent on those pages, unique device identifiers and other diagnostic data. When You access the Service by or through a mobile device, We may collect certain information automatically, including, but not limited to, the type of mobile device You use, Your mobile device's unique ID, the IP address of Your mobile device, Your mobile operating system, the type of mobile Internet browser You use, unique device identifiers and other diagnostic data."
                },
                {
                    title: "4. Tracking Technologies and Cookies",
                    content: "We use Cookies and similar tracking technologies to track the activity on Our Service and store certain information. Tracking technologies We use include beacons, tags, and scripts to collect and track information and to improve and analyze Our Service. The technologies We use may include: Cookies or Browser Cookies — a small file placed on Your Device. You can instruct Your browser to refuse all Cookies or to indicate when a Cookie is being sent; however, if You do not accept Cookies, You may not be able to use some parts of our Service. Web Beacons — certain sections of our Service and our emails may contain small electronic files known as web beacons that permit the Company to count users who have visited those pages or opened an email and for other related website statistics.",
                    secondaryContent: "Cookies can be \"Persistent\" or \"Session\" Cookies. Persistent Cookies remain on Your personal computer or mobile device when You go offline, while Session Cookies are deleted as soon as You close Your web browser. Where required by law, we use non-essential cookies (such as analytics, advertising, and remarketing cookies) only with Your consent. You can withdraw or change Your consent at any time using Our cookie preferences tool (if available) or through Your browser/device settings. We use both Session and Persistent Cookies: Necessary/Essential Cookies (Session) — essential to provide You with services available through the Website; Cookies Policy Notice Acceptance Cookies (Persistent) — identify if users have accepted the use of cookies; Functionality Cookies (Persistent) — allow Us to remember choices You make when You use the Website."
                },
                {
                    title: "5. Use of Your Personal Data",
                    content: "The Company may use Personal Data for the following purposes:",
                    listItems: [
                        "To provide and maintain our Service, including to monitor the usage of our Service",
                        "To manage Your Account: to manage Your registration as a user of the Service",
                        "For the performance of a contract: the development, compliance and undertaking of the purchase contract for the products, items or services You have purchased or of any other contract with Us through the Service",
                        "To contact You: by email, telephone calls, SMS, or other equivalent forms of electronic communication regarding updates or informative communications related to the functionalities, products or contracted services",
                        "To provide You with news, special offers, and general information about other goods, services and events which We offer that are similar to those that you have already purchased or inquired about unless You have opted not to receive such information",
                        "To manage Your requests: To attend and manage Your requests to Us",
                        "For business transfers: We may use Your Personal Data to evaluate or conduct a merger, divestiture, restructuring, reorganization, dissolution, or other sale or transfer of some or all of Our assets",
                        "For other purposes: data analysis, identifying usage trends, determining the effectiveness of our promotional campaigns and to evaluate and improve our Service"
                    ],
                    secondaryContent: "We may share Your Personal Data: With Service Providers to monitor and analyze the use of our Service, to contact You; For business transfers in connection with any merger, sale of Company assets, financing, or acquisition; With Affiliates, in which case we will require those affiliates to honor this Privacy Policy; With business partners to offer You certain products, services or promotions; With other users in public areas when You share Personal Data or otherwise interact; With Your consent for any other purpose."
                },
                {
                    title: "6. Retention of Your Personal Data",
                    content: "The Company will retain Your Personal Data only for as long as is necessary for the purposes set out in this Privacy Policy. We will retain and use Your Personal Data to the extent necessary to comply with our legal obligations, resolve disputes, and enforce our legal agreements and policies. Where possible, We apply shorter retention periods and/or reduce identifiability by deleting, aggregating, or anonymizing data.",
                    listItems: [
                        "Account Information — User Accounts: retained for the duration of your account relationship plus up to 24 months after account closure",
                        "Customer Support Data — Support tickets and correspondence: up to 24 months from the date of ticket closure; Chat transcripts: up to 24 months for quality assurance and staff training",
                        "Usage Data — Website analytics data (cookies, IP addresses, device identifiers): up to 24 months from the date of collection; Server logs (IP addresses, access times): up to 24 months for security monitoring and troubleshooting"
                    ],
                    secondaryContent: "We may retain Personal Data beyond the periods stated for: Legal obligation; Legal claims; Your explicit request; Technical limitations (e.g., backup systems). When retention periods expire, We securely delete or anonymize Personal Data. Residual copies may remain in encrypted backups for a limited period. You may request information about how long We will retain Your Personal Data by contacting Us."
                },
                {
                    title: "7. Transfer of Your Personal Data",
                    content: "Your information, including Personal Data, is processed at the Company's operating offices and in any other places where the parties involved in the processing are located. It means that this information may be transferred to — and maintained on — computers located outside of Your state, province, country or other governmental jurisdiction where the data protection laws may differ from those from Your jurisdiction. Where required by applicable law, We will ensure that international transfers of Your Personal Data are subject to appropriate safeguards. The Company will take all steps reasonably necessary to ensure that Your data is treated securely and in accordance with this Privacy Policy."
                },
                {
                    title: "8. Delete Your Personal Data",
                    content: "You have the right to delete or request that We assist in deleting the Personal Data that We have collected about You. Our Service may give You the ability to delete certain information about You from within the Service. You may update, amend, or delete Your information at any time by signing in to Your Account, if you have one, and visiting the account settings section. You may also contact Us to request access to, correct, or delete any Personal Data that You have provided to Us. Please note, however, that We may need to retain certain information when we have a legal obligation or lawful basis to do so."
                },
                {
                    title: "9. Disclosure of Your Personal Data",
                    content: "Business Transactions: If the Company is involved in a merger, acquisition or asset sale, Your Personal Data may be transferred. We will provide notice before Your Personal Data is transferred and becomes subject to a different Privacy Policy. Law enforcement: Under certain circumstances, the Company may be required to disclose Your Personal Data if required to do so by law or in response to valid requests by public authorities (e.g. a court or a government agency). Other legal requirements: The Company may disclose Your Personal Data in the good faith belief that such action is necessary to:",
                    listItems: [
                        "Comply with a legal obligation",
                        "Protect and defend the rights or property of the Company",
                        "Prevent or investigate possible wrongdoing in connection with the Service",
                        "Protect the personal safety of Users of the Service or the public",
                        "Protect against legal liability"
                    ]
                },
                {
                    title: "10. Security of Your Personal Data",
                    content: "The security of Your Personal Data is important to Us, but remember that no method of transmission over the Internet, or method of electronic storage is 100% secure. While We strive to use commercially reasonable means to protect Your Personal Data, We cannot guarantee its absolute security."
                },
                {
                    title: "11. Children's Privacy",
                    content: "Our Service does not address anyone under the age of 16. We do not knowingly collect personally identifiable information from anyone under the age of 16. If You are a parent or guardian and You are aware that Your child has provided Us with Personal Data, please contact Us. If We become aware that We have collected Personal Data from anyone under the age of 16 without verification of parental consent, We take steps to remove that information from Our servers. If We need to rely on consent as a legal basis for processing Your information and Your country requires consent from a parent, We may require Your parent's consent before We collect and use that information."
                },
                {
                    title: "12. Links to Other Websites",
                    content: "Our Service may contain links to other websites that are not operated by Us. If You click on a third party link, You will be directed to that third party's site. We strongly advise You to review the Privacy Policy of every site You visit. We have no control over and assume no responsibility for the content, privacy policies or practices of any third party sites or services."
                },
                {
                    title: "13. Changes to this Privacy Policy",
                    content: "We may update Our Privacy Policy from time to time. We will notify You of any changes by posting the new Privacy Policy on this page. We will let You know via email and/or a prominent notice on Our Service, prior to the change becoming effective and update the \"Last updated\" date at the top of this Privacy Policy. You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page."
                },
                {
                    title: "14. Contact Us",
                    content: "If you have any questions about this Privacy Policy, You can contact us:",
                    secondaryContent: "By email: zionicarc@gmail.com"
                }
            ]
        },
        termsOfService: {
            lastUpdated: "February 27, 2026",
            sections: [
                {
                    title: "1. Introduction",
                    content: "Please read these terms and conditions carefully before using Our Service."
                },
                {
                    title: "2. Interpretation and Definitions",
                    content: "The words whose initial letters are capitalized have meanings defined under the following conditions. The following definitions shall have the same meaning regardless of whether they appear in singular or in plural.",
                    secondaryContent: "For the purposes of these Terms and Conditions: Affiliate means an entity that controls, is controlled by, or is under common control with a party, where \"control\" means ownership of 50% or more of the shares, equity interest or other securities entitled to vote for election of directors or other managing authority. Country refers to: Karnataka, India. Company (referred to as either \"the Company\", \"We\", \"Us\" or \"Our\") refers to Zionic Arc. Device means any device that can access the Service such as a computer, a cell phone or a digital tablet. Service refers to the Website. Terms and Conditions (also referred to as \"Terms\") means these Terms and Conditions, including any documents expressly incorporated by reference, which govern Your access to and use of the Service and form the entire agreement between You and the Company regarding the Service. These Terms and Conditions have been created with the help of the TermsFeed Terms and Conditions Generator. Third-Party Social Media Service means any services or content provided by a third party that is displayed, included, made available, or linked to through the Service. Website refers to Zionic Arc, accessible from https://www.zionicarc.com/. You means the individual accessing or using the Service, or the company, or other legal entity on behalf of which such individual is accessing or using the Service, as applicable."
                },
                {
                    title: "3. Acknowledgment",
                    content: "These are the Terms and Conditions governing the use of this Service and the agreement between You and the Company. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service. Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users and others who access or use the Service. By accessing or using the Service You agree to be bound by these Terms and Conditions. If You disagree with any part of these Terms and Conditions then You may not access the Service. You represent that you are over the age of 18. The Company does not permit those under 18 to use the Service. Your access to and use of the Service is also subject to Our Privacy Policy, which describes how We collect, use, and disclose personal information. Please read Our Privacy Policy carefully before using Our Service."
                },
                {
                    title: "4. Links to Other Websites",
                    content: "Our Service may contain links to third-party websites or services that are not owned or controlled by the Company. The Company has no control over, and assumes no responsibility for, the content, privacy policies, or practices of any third-party websites or services. You further acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with the use of or reliance on any such content, goods or services available on or through any such websites or services. We strongly advise You to read the terms and conditions and privacy policies of any third-party websites or services that You visit."
                },
                {
                    title: "5. Links from a Third-Party Social Media Service",
                    content: "The Service may display, include, make available, or link to content or services provided by a Third-Party Social Media Service. A Third-Party Social Media Service is not owned or controlled by the Company, and the Company does not endorse or assume responsibility for any Third-Party Social Media Service. You acknowledge and agree that the Company shall not be responsible or liable, directly or indirectly, for any damage or loss caused or alleged to be caused by or in connection with Your access to or use of any Third-Party Social Media Service, including any content, goods, or services made available through them. Your use of any Third-Party Social Media Service is governed by that Third-Party Social Media Service's terms and privacy policies."
                },
                {
                    title: "6. Termination",
                    content: "We may terminate or suspend Your access immediately, without prior notice or liability, for any reason whatsoever, including without limitation if You breach these Terms and Conditions. Upon termination, Your right to use the Service will cease immediately."
                },
                {
                    title: "7. Limitation of Liability",
                    content: "Notwithstanding any damages that You might incur, the entire liability of the Company and any of its suppliers under any provision of these Terms and Your exclusive remedy for all of the foregoing shall be limited to the amount actually paid by You through the Service or 100 USD if You haven't purchased anything through the Service. To the maximum extent permitted by applicable law, in no event shall the Company or its suppliers be liable for any special, incidental, indirect, or consequential damages whatsoever (including, but not limited to, damages for loss of profits, loss of data or other information, for business interruption, for personal injury, loss of privacy arising out of or in any way related to the use of or inability to use the Service, third-party software and/or third-party hardware used with the Service, or otherwise in connection with any provision of these Terms), even if the Company or any supplier has been advised of the possibility of such damages and even if the remedy fails of its essential purpose. Some states do not allow the exclusion of implied warranties or limitation of liability for incidental or consequential damages, which means that some of the above limitations may not apply. In these states, each party's liability will be limited to the greatest extent permitted by law."
                },
                {
                    title: "8. \"AS IS\" and \"AS AVAILABLE\" Disclaimer",
                    content: "The Service is provided to You \"AS IS\" and \"AS AVAILABLE\" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the Company, on its own behalf and on behalf of its Affiliates and its and their respective licensors and service providers, expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service, including all implied warranties of merchantability, fitness for a particular purpose, title and non-infringement, and warranties that may arise out of course of dealing, course of performance, usage or trade practice. Without limitation to the foregoing, the Company provides no warranty or undertaking, and makes no representation of any kind that the Service will meet Your requirements, achieve any intended results, be compatible or work with any other software, applications, systems or services, operate without interruption, meet any performance or reliability standards or be error free or that any errors or defects can or will be corrected. Without limiting the foregoing, neither the Company nor any of the company's provider makes any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service; or (iv) that the Service, its servers, the content, or e-mails sent from or on behalf of the Company are free of viruses, scripts, trojan horses, worms, malware, timebombs or other harmful components. Some jurisdictions do not allow the exclusion of certain types of warranties or limitations on applicable statutory rights of a consumer, so some or all of the above exclusions and limitations may not apply to You. But in such a case the exclusions and limitations set forth in this section shall be applied to the greatest extent enforceable under applicable law."
                },
                {
                    title: "9. Governing Law",
                    content: "The laws of the Country, excluding its conflicts of law rules, shall govern these Terms and Your use of the Service. Your use of the Application may also be subject to other local, state, national, or international laws."
                },
                {
                    title: "10. Disputes Resolution",
                    content: "If You have any concern or dispute about the Service, You agree to first try to resolve the dispute informally by contacting the Company."
                },
                {
                    title: "11. For European Union (EU) Users",
                    content: "If You are a European Union consumer, you will benefit from any mandatory provisions of the law of the country in which You are resident."
                },
                {
                    title: "12. United States Legal Compliance",
                    content: "You represent and warrant that (i) You are not located in a country that is subject to the United States government embargo, or that has been designated by the United States government as a \"terrorist supporting\" country, and (ii) You are not listed on any United States government list of prohibited or restricted parties."
                },
                {
                    title: "13. Severability and Waiver",
                    content: "Severability: If any provision of these Terms is held to be unenforceable or invalid, such provision will be changed and interpreted to accomplish the objectives of such provision to the greatest extent possible under applicable law and the remaining provisions will continue in full force and effect. Waiver: Except as provided herein, the failure to exercise a right or to require performance of an obligation under these Terms shall not affect a party's ability to exercise such right or require such performance at any time thereafter nor shall the waiver of a breach constitute a waiver of any subsequent breach."
                },
                {
                    title: "14. Translation Interpretation",
                    content: "These Terms and Conditions may have been translated if We have made them available to You on our Service. You agree that the original English text shall prevail in the case of a dispute."
                },
                {
                    title: "15. Changes to These Terms and Conditions",
                    content: "We reserve the right, at Our sole discretion, to modify or replace these Terms at any time. If a revision is material We will make reasonable efforts to provide at least 30 days' notice prior to any new terms taking effect. What constitutes a material change will be determined at Our sole discretion. By continuing to access or use Our Service after those revisions become effective, You agree to be bound by the revised terms. If You do not agree to the new terms, in whole or in part, please stop using the Service."
                },
                {
                    title: "16. Contact Us",
                    content: "If you have any questions about these Terms and Conditions, You can contact us:",
                    listItems: [
                        "By email: zionicarc@gmail.com",
                        "By visiting this page on our website: https://www.zionicarc.com/#contact",
                        "By phone: 9986598000",
                        "By mail: 229, 4Main, 5 Cross, Viveknagar, Bangalore"
                    ]
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

    const syncLegalToFirebase = async () => {
        const merged = {
            ...settings,
            privacyPolicy: defaultSettings.privacyPolicy,
            termsOfService: defaultSettings.termsOfService
        };
        await updateSettings(merged);
    };

    const getDefaultLegalDocuments = () => ({
        privacyPolicy: defaultSettings.privacyPolicy,
        termsOfService: defaultSettings.termsOfService
    });

    return (
        <SiteContext.Provider value={{ settings, updateSettings, syncLegalToFirebase, getDefaultLegalDocuments, loading }}>
            {children}
        </SiteContext.Provider>
    );
};

export const useSite = () => useContext(SiteContext);

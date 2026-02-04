import interiorImage from '../assets/interior-design.png';

export default function ServicesDetail() {
    const services = [
        {
            title: "Residential Architecture",
            subtitle: "Contemporary and Tailored",
            desc: "Our residential architecture expertise transforms spaces into exceptional homes that balance aesthetics and functionality.",
            image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Interior Design",
            subtitle: "Luxury, Seamless execution, Price Conscious.",
            desc: "We deliver personalized interior design and build services; complete refurbishments, extensions, existing space conversions and top notch renovations.",
            image: interiorImage
        },
        {
            title: "Institutional Architecture",
            subtitle: "Designing across generations.",
            desc: "We specialize in designing institutional buildings that inspire learning, collaboration, and community engagement. Our institutional architecture encompasses educational facilities, cultural centers, and public buildings that serve as landmarks of excellence.",
            image: "https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=2086&auto=format&fit=crop"
        },
        {
            title: "Commercial Architecture",
            subtitle: "Tailored Expertise across every stage.",
            desc: "We create spaces that transform employee well-being, boost productivity, and represent your brand’s personality, helping clients understand your business and capture your brand values.",
            image: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Construction Monitoring",
            subtitle: "Precision oversight from foundation to finish.",
            desc: "Regular site visits and progress reports to verify contractor performance and quality.",
            image: "https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=2070&auto=format&fit=crop"
        },
        {
            title: "Fellowship and Mentorship",
            subtitle: "Nurturing the next generation of architects.",
            desc: "Z'IONIC ARC is committed to building an inclusive and equitable workplace by investing in programs that support mentorship, professional development, and expanded access to opportunity.",
            image: "https://images.unsplash.com/photo-1657185140919-db37897e0fd5?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        }
    ];

    return (
        <section id="detailed-services" className="py-24 bg-white">
            <div className="max-w-7xl mx-auto px-6 md:px-8">

                {/* Section Heading */}
                <div className="mb-16 text-center md:text-left">
                    <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] mb-8">
                        Our Services
                    </h2>
                    <p className="text-gray-600 text-lg max-w-sm mx-auto md:mx-0 leading-relaxed font-normal">
                        From bold architectural concepts to refined interiors Z'IONIC ARC delivers end to end solutions.
                    </p>
                </div>

                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
                    {services.map((service, index) => (
                        <div key={index} className="group cursor-default">
                            <div className="overflow-hidden rounded-2xl aspect-[4/5] mb-8 bg-gray-100 shadow-sm transition-all duration-500 hover:shadow-2xl hover:-translate-y-2">
                                <img
                                    src={service.image}
                                    alt={service.title}
                                    className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700 ease-in-out scale-100 group-hover:scale-110"
                                    loading="lazy"
                                />
                            </div>
                            <div className="space-y-4 px-2 text-center md:text-left">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-normal tracking-tight text-black">
                                        {service.title}
                                    </h3>
                                    {service.subtitle && (
                                        <p className="text-sm font-medium uppercase tracking-[0.2em] text-black/50">
                                            {service.subtitle}
                                        </p>
                                    )}
                                </div>
                                <p className="text-gray-600 leading-relaxed font-normal text-[15px] lg:text-[16px]">
                                    {service.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </section>
    );
}

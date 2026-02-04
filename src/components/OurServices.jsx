import React from 'react';
import { Box, Layers, Compass } from 'lucide-react';

export default React.memo(function Services() {
  const services = [
    {
      title: "Architecture",
      desc: "Sustainable and functional design from concept to construction.",
      icon: <Box size={24} />
    },
    {
      title: "Interior Architecture",
      desc: "We deliver personalized interior design and build services; complete refurbishments, extensions, existing space conversions and top notch renovations.",
      icon: <Layers size={24} />
    },
    {
      title: "Urban Planning",
      desc: "Strategic development for community-centric environments.",
      icon: <Compass size={24} />
    }
  ];

  return (
    <section id="services" className="py-24 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] mb-8">
              Our Expertise
            </h2>
            <p className="text-gray-600 text-lg max-w-sm mx-auto md:mx-0 leading-relaxed font-normal">
              We deliver comprehensive design solutions that respect context, geography, and culture.
            </p>
          </div>

          <div className="col-span-1 md:col-span-8 grid gap-6 md:gap-8">
            {services.map((s, i) => (
              <div key={i} className="group cursor-default relative bg-white p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-xl border border-transparent rounded-sm">
                <div className="flex flex-col md:flex-row items-center md:items-start gap-6 text-center md:text-left">
                  <div className="p-4 bg-gray-50 rounded-full transition-all duration-300 group-hover:bg-black group-hover:text-white shrink-0">
                    {s.icon}
                  </div>
                  <div>
                    <h3 className="text-2xl font-normal mb-2 transition-colors duration-300 text-black">{s.title}</h3>
                    <p className="text-gray-600 max-w-md transition-colors duration-300 font-normal leading-relaxed">{s.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
});
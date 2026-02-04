import React from 'react';
import { Lightbulb, Settings, Users, CheckCircle, Award, Compass, Layers, Box } from 'lucide-react';
import { useSite } from '../context/SiteContext';

const IconMap = {
  Lightbulb,
  Settings,
  Users,
  CheckCircle,
  Award,
  Compass,
  Layers,
  Box
};

export default React.memo(function Services() {
  const { settings } = useSite();
  const expertise = settings.expertise;

  return (
    <section id="services" className="py-24 bg-[#f8f8f8]">
      <div className="max-w-7xl mx-auto px-8">

        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-16">
          <div className="col-span-1 md:col-span-4 flex flex-col items-center md:items-start text-center md:text-left pt-2">
            <h2 className="text-3xl md:text-4xl font-outfit font-light tracking-tighter text-black leading-[0.9] mb-8">
              {expertise.title}
            </h2>
            <p className="text-gray-600 text-lg max-w-sm mx-auto md:mx-0 leading-relaxed font-normal">
              {expertise.caption}
            </p>
          </div>

          <div className="col-span-1 md:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
            {expertise.items.map((s, i) => {
              const Icon = IconMap[s.icon] || Box;
              return (
                <div key={i} className="group cursor-default relative bg-white p-6 md:p-8 transition-all duration-300 ease-out hover:-translate-y-[6px] hover:shadow-xl border border-black/5 rounded-2xl flex flex-col items-start gap-4">
                  <div className="p-3 bg-gray-50 rounded-xl transition-all duration-300 group-hover:bg-black group-hover:text-white shrink-0">
                    <Icon size={24} />
                  </div>
                  <p className="text-gray-800 text-sm md:text-[15px] transition-colors duration-300 font-normal leading-relaxed">
                    {s.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </section>
  );
});
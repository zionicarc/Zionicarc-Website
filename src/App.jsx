import React, { Suspense, lazy } from "react";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Expertise from "./components/OurExpertise";
import Footer from "./components/Footer";

// Lazy load non-critical sections
const OurApproach = lazy(() => import("./components/OurApproach"));
const ServicesDetail = lazy(() => import("./components/ServicesDetail"));
const Projects = lazy(() => import("./components/Projects"));
const WhyChooseUs = lazy(() => import("./components/WhyChooseUs"));
const Contact = lazy(() => import("./components/Contact"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));

// Simple lightweight loading component
const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center opacity-0 animate-pulse">
    <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
  </div>
);

const App = () => {
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = React.useState(false);

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <About />
        <Expertise />
        <Suspense fallback={<SectionLoader />}>
          <OurApproach />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <ServicesDetail />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Projects />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <WhyChooseUs />
        </Suspense>
        <Suspense fallback={<SectionLoader />}>
          <Contact />
        </Suspense>
      </main>
      <Footer
        onOpenTerms={() => setIsTermsOpen(true)}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
      />

      <Suspense fallback={null}>
        {isTermsOpen && <TermsOfService isOpen={isTermsOpen} onClose={() => setIsTermsOpen(false)} />}
        {isPrivacyOpen && <PrivacyPolicy isOpen={isPrivacyOpen} onClose={() => setIsPrivacyOpen(false)} />}
      </Suspense>
    </>
  );
};

export default App;
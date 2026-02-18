import React, { Suspense, lazy } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { SiteProvider, useSite } from "./context/SiteContext";
import Navbar from "./components/Navbar";
import Hero from "./components/Hero";
import About from "./components/About";
import Vision from "./components/Vision";
import Expertise from "./components/OurExpertise";
import Footer from "./components/Footer";

// Lazy load non-critical sections
const OurApproach = lazy(() => import("./components/OurApproach"));
const ServicesDetail = lazy(() => import("./components/ServicesDetail"));
const Projects = lazy(() => import("./components/Projects"));
const Gallery = lazy(() => import("./components/Gallery"));
const WhyChooseUs = lazy(() => import("./components/WhyChooseUs"));
const Contact = lazy(() => import("./components/Contact"));
const GalleryPage = lazy(() => import("./pages/GalleryPage"));
const TermsOfService = lazy(() => import("./components/TermsOfService"));
const PrivacyPolicy = lazy(() => import("./components/PrivacyPolicy"));
const AdminDashboard = lazy(() => import("./components/AdminDashboard"));

// Simple lightweight loading component
const SectionLoader = () => (
  <div className="w-full h-32 flex items-center justify-center opacity-0 animate-pulse">
    <div className="w-8 h-8 border-2 border-gray-200 border-t-black rounded-full animate-spin"></div>
  </div>
);

const MainSite = () => {
  const [isTermsOpen, setIsTermsOpen] = React.useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = React.useState(false);
  const { settings } = useSite();

  return (
    <>
      <Navbar />
      <main>
        <Hero />
        {settings.showAbout && <About />}
        {settings.showVision && <Vision />}
        {settings.showExpertise && <Expertise />}
        {settings.showApproach && (
          <Suspense fallback={<SectionLoader />}>
            <OurApproach />
          </Suspense>
        )}
        {settings.showProjects && (
          <Suspense fallback={<SectionLoader />}>
            <Projects />
          </Suspense>
        )}
        {settings.showServices && (
          <Suspense fallback={<SectionLoader />}>
            <ServicesDetail />
          </Suspense>
        )}

        {settings.showWhyChooseUs && (
          <Suspense fallback={<SectionLoader />}>
            <WhyChooseUs />
          </Suspense>
        )}

        {settings.showGallery && (
          <Suspense fallback={<SectionLoader />}>
            <Gallery />
          </Suspense>
        )}

        {settings.showContact && (
          <Suspense fallback={<SectionLoader />}>
            <Contact />
          </Suspense>
        )}
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

const App = () => {
  return (
    <Router>
      <SiteProvider>
        <Routes>
          <Route path="/" element={<MainSite />} />
          <Route path="/gallery" element={
            <Suspense fallback={<div className="h-screen bg-white" />}>
              <GalleryPage />
            </Suspense>
          } />
          <Route path="/admin" element={
            <Suspense fallback={<div className="h-screen bg-black" />}>
              <AdminDashboard />
            </Suspense>
          } />
        </Routes>
      </SiteProvider>
    </Router>
  );
};

export default App;
import Hero from '../../components/public/Hero';
import ProblemSection from '../../components/public/ProblemSection';
import ObjectivesSection from '../../components/public/ObjectivesSection';
import LocationsSection from '../../components/public/LocationsSection';
import TimelineSection from '../../components/public/TimelineSection';
import SustainabilitySection from '../../components/public/SustainabilitySection';
import PerformanceSection from '../../components/public/PerformanceSection';
import MissionVisionSection from '../../components/public/MissionVisionSection';
import TeamSection from '../../components/public/TeamSection';
import PartnersSection from '../../components/public/PartnersSection';
import Footer from '../../components/public/Footer';

export default function HomePage() {
  return (
    <>
      <Hero />
      <ProblemSection />
      <ObjectivesSection />
      <LocationsSection />
      <TimelineSection />
      <SustainabilitySection />
      <PerformanceSection />
      <MissionVisionSection />
      <TeamSection />
      <PartnersSection />
      <Footer />
    </>
  );
}

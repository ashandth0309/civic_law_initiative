import SectionWrapper from '../ui/SectionWrapper';
import SectionHeader from '../ui/SectionHeader';

export default function SustainabilitySection() {
  return (
    <SectionWrapper id="sustainability">
      <SectionHeader num="05" sub="Future Outlook" title="Sustainability & Amplification" />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.8, color: '#2a2520' }}>
          <p>
            <strong style={{ fontWeight: 600 }}>Sustainability Plan:</strong> The project is designed to generate lasting impact by strengthening knowledge, networks, and continued engagement among participants. These connections will continue through alumni engagement facilitated by the SUSI Rule of Law Alumni.
          </p>
          <p className="mt-4">A key outcome of the national culminating forum will be the development of a policy brief summarizing the discussions, findings, and recommendations generated throughout the regional workshops.</p>
        </div>
        <div style={{ fontFamily: "'Cormorant Garamond', Georgia, serif", fontSize: '0.95rem', fontWeight: 300, lineHeight: 1.8, color: '#2a2520' }}>
          <p>
            <strong style={{ fontWeight: 600 }}>Amplification Plan:</strong> The project will reach secondary and tertiary audiences through multiple channels. Secondary audiences include academic institutions and law faculties across Sri Lanka, civil society organizations, and policy stakeholders.
          </p>
          <p className="mt-4">Tertiary audiences include the broader public, reached via social media, press coverage, and online dissemination.</p>
        </div>
      </div>
    </SectionWrapper>
  );
}

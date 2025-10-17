'use client';
import React from 'react';
import ProfileHeader from "@/components/ProfileHeader";
import InfoCard from "@/components/InfoCard";
import SkillsCard from "@/components/SkillsCard";
import DocumentsCard from "@/components/DocumentsCard";
import SidebarCard from "@/components/SidebarCard";
import ApplicationsSection from "@/components/ApplicationsSection";
import InterviewsSection from "@/components/InterviewsSection";

const sampleCompany = {
  name: 'Tech Solutions Inc.',
  subtitle: 'Hiring Top Talent',
  verified: true,
  photo: '/company-logo.png',
  infoCards: [
    { title: 'Company Info', fields: [{ label: 'Email', value: 'hr@techsolutions.com' }, { label: 'Phone', value: '+123456789' }] },
    { title: 'Location', fields: [{ label: 'City', value: 'San Francisco' }, { label: 'Address', value: '123 Market St' }] },
  ],
  skills: ['JavaScript', 'React', 'Node.js'], 
  documents: [
    { name: 'Company Brochure.pdf', meta: 'Updated 1 month ago' },
  ],
  sidebar: {
    title: 'Profile Completion',
    progress: 90,
    tasks: [
      { name: 'Add Jobs', status: 'Done' },
      { name: 'Complete Company Info', status: 'Pending' },
    ],
  },
  applications: [
    { title: 'Frontend Developer', student: 'John Doe', status: 'pending', tags: ['Remote', 'Full-time'] },
  ],
  interviews: [
    { title: 'Frontend Developer', student: 'John Doe', date: '2025-10-22', location: 'Zoom', status: 'scheduled' },
  ],
};

const CompanyProfilePage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ProfileHeader
        name={sampleCompany.name}
        subtitle={sampleCompany.subtitle}
        verified={sampleCompany.verified}
        photo={sampleCompany.photo}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-2 flex flex-col gap-8">
          {sampleCompany.infoCards.map((card, idx) => (
            <InfoCard key={idx} title={card.title} fields={card.fields} />
          ))}

          <SkillsCard skills={sampleCompany.skills} />
          <DocumentsCard documents={sampleCompany.documents} />
          <ApplicationsSection applications={sampleCompany.applications} />
          <InterviewsSection interviews={sampleCompany.interviews} />
        </div>

        {/* Right Column */}
        <div className="flex-1">
          <SidebarCard
            title={sampleCompany.sidebar.title}
            progress={sampleCompany.sidebar.progress}
            tasks={sampleCompany.sidebar.tasks}
          />
        </div>
      </main>
    </div>
  );
};

export default CompanyProfilePage;

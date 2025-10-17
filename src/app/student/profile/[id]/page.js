'use client';
import React from 'react';
import ProfileHeader from "@/components/ProfileHeader";
import InfoCard from "@/components/InfoCard";
import SkillsCard from "@/components/SkillsCard";
import DocumentsCard from "@/components/DocumentsCard";
import SidebarCard from "@/components/SidebarCard";
import ApplicationsSection from "@/components/ApplicationsSection";
import InterviewsSection from "@/components/InterviewsSection";


const sampleStudent = {
  name: 'Charles Mendez',
  subtitle: 'Computer Science Student',
  verified: true,
  photo: '/student.jpg',
  infoCards: [
    { title: 'Personal Info', fields: [{ label: 'Email', value: 'charles@example.com' }, { label: 'Phone', value: '+1234567890' }] },
    { title: 'Education', fields: [{ label: 'University', value: 'MIT' }, { label: 'Degree', value: 'BSc Computer Science' }] },
  ],
  skills: ['React', 'Next.js', 'Tailwind', 'Node.js'],
  documents: [
    { name: 'Resume.pdf', meta: 'Updated 1 week ago' },
    { name: 'Transcript.pdf', meta: 'Updated 2 weeks ago' },
  ],
  sidebar: {
    title: 'Profile Completion',
    progress: 80,
    tasks: [
      { name: 'Upload Resume', status: 'Done' },
      { name: 'Add Skills', status: 'Pending' },
    ],
  },
  applications: [
    { title: 'Frontend Developer', company: 'ABC Corp', status: 'accepted', tags: ['Remote', 'Full-time'] },
    { title: 'Backend Developer', company: 'XYZ Inc', status: 'pending', tags: ['On-site', 'Internship'] },
  ],
  interviews: [
    { title: 'Frontend Developer', company: 'ABC Corp', date: '2025-10-20', location: 'Zoom', status: 'scheduled' },
    { title: 'Backend Developer', company: 'XYZ Inc', date: '2025-10-25', location: 'Office', status: 'completed' },
  ],
};

const StudentProfilePage = () => {
  return (
    <div className="min-h-screen bg-white text-gray-900">
      <ProfileHeader
        name={sampleStudent.name}
        subtitle={sampleStudent.subtitle}
        verified={sampleStudent.verified}
        photo={sampleStudent.photo}
      />

      <main className="max-w-7xl mx-auto px-6 py-8 flex flex-col lg:flex-row gap-8">
        {/* Left Column */}
        <div className="flex-2 flex flex-col gap-8">
          {sampleStudent.infoCards.map((card, idx) => (
            <InfoCard key={idx} title={card.title} fields={card.fields} />
          ))}

          <SkillsCard skills={sampleStudent.skills} />
          <DocumentsCard documents={sampleStudent.documents} />
          <ApplicationsSection applications={sampleStudent.applications} />
          <InterviewsSection interviews={sampleStudent.interviews} />
        </div>

        {/* Right Column */}
        <div className="flex-1">
          <SidebarCard
            title={sampleStudent.sidebar.title}
            progress={sampleStudent.sidebar.progress}
            tasks={sampleStudent.sidebar.tasks}
          />
        </div>
      </main>
    </div>
  );
};

export default StudentProfilePage;
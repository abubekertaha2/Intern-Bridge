// SkillsCard.js
'use client';
import React, { useState } from 'react';

const SkillsCard = ({ skills: initialSkills, editable = false }) => {
  const [skills, setSkills] = useState(initialSkills);
  const [newSkill, setNewSkill] = useState('');

  const addSkill = () => {
    if (newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setSkills(skills.filter(s => s !== skill));
  };

  return (
    <div className="bg-blue-100 p-6 rounded-xl flex flex-col gap-4">
      <h3 className="text-xl font-bold">Skills</h3>
      <div className="flex flex-wrap gap-2">
        {skills.map((skill, idx) => (
          <div key={idx} className="bg-blue-600 text-white px-3 py-1 rounded flex items-center gap-2">
            {skill}
            {editable && <button onClick={() => removeSkill(skill)} className="font-bold">×</button>}
          </div>
        ))}
      </div>
      {editable && (
        <div className="flex gap-2 mt-2">
          <input
            type="text"
            value={newSkill}
            onChange={(e) => setNewSkill(e.target.value)}
            className="p-2 rounded border border-gray-300 flex-1"
            placeholder="Add new skill"
          />
          <button onClick={addSkill} className="bg-blue-600 text-white px-4 rounded">Add</button>
        </div>
      )}
    </div>
  );
};

export default SkillsCard;

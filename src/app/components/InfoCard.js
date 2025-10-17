// InfoCard.js
'use client';
import React, { useState } from 'react';

const InfoCard = ({ title, fields, editable = false }) => {
  const [localFields, setLocalFields] = useState(fields);

  const handleChange = (index, value) => {
    const updated = [...localFields];
    updated[index].value = value;
    setLocalFields(updated);
  };

  return (
    <div className="bg-blue-100 p-6 rounded-xl flex flex-col gap-4">
      <h3 className="text-xl font-bold">{title}</h3>
      {localFields.map((field, idx) => (
        <div key={idx} className="flex flex-col gap-1">
          <span className="font-semibold">{field.label}</span>
          {editable ? (
            <input
              type="text"
              value={field.value}
              onChange={(e) => handleChange(idx, e.target.value)}
              className="p-2 rounded border border-gray-300"
            />
          ) : (
            <span className="text-gray-700">{field.value}</span>
          )}
        </div>
      ))}
    </div>
  );
};

export default InfoCard;


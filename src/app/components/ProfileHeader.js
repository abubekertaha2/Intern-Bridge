'use client';

import { useState } from 'react';

export default function ProfileHeader({ isEditable }) {
  const [name, setName] = useState('Charles Mendez');
  const [subtitle, setSubtitle] = useState('Frontend Developer/ Client');
  const [photo, setPhoto] = useState(null);

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setPhoto(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="relative flex flex-col md:flex-row items-center gap-6 bg-gradient-to-r from-blue-600 to-blue-800 text-white p-8 rounded-xl">
      {/* Profile Photo */}
      <div className="relative w-56 h-56 rounded-full bg-white p-2 flex items-center justify-center overflow-hidden">
        {photo ? (
          <img src={photo} alt="Profile" className="w-full h-full object-cover rounded-full" />
        ) : (
          <div className="w-full h-full bg-gray-200 rounded-full flex items-center justify-center text-gray-500">
            No Image
          </div>
        )}
        {isEditable && (
          <input
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        )}
      </div>

      {/* Profile Info */}
      <div className="flex-1 flex flex-col gap-2 md:gap-4">
        {isEditable ? (
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="text-5xl md:text-6xl font-bold text-white bg-transparent border-b border-white focus:outline-none"
          />
        ) : (
          <h1 className="text-5xl md:text-6xl font-bold">{name}</h1>
        )}

        {isEditable ? (
          <input
            value={subtitle}
            onChange={(e) => setSubtitle(e.target.value)}
            className="text-xl md:text-2xl font-medium text-white bg-transparent border-b border-white focus:outline-none"
          />
        ) : (
          <h2 className="text-xl md:text-2xl font-medium">{subtitle}</h2>
        )}

        <div className="mt-2 inline-flex items-center gap-2 bg-white text-blue-800 px-3 py-1 rounded-lg font-medium">
          Verified
        </div>
      </div>
    </div>
  );
}

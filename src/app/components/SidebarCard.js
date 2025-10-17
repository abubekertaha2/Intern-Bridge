"use client";
import React from "react";

export default function SidebarCard() {
  const profileCompletion = 75; // percentage

  const languages = [
    { name: "English", level: "Advanced", progress: 90 },
    { name: "Spanish", level: "Intermediate", progress: 60 },
    { name: "French", level: "Beginner", progress: 30 },
  ];

  const stats = [
    { label: "Aplicaciones Enviadas", value: 12 },
    { label: "Entrevistas Programadas", value: 3 },
    { label: "Perfil Visto", value: 48 },
  ];

  return (
    <aside className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-6">
      {/* Profile Completion */}
      <div>
        <h3 className="text-xl font-bold text-[#1C274D] mb-2">
          Completitud del Perfil
        </h3>
        <div className="w-full bg-gray-200 rounded-full h-4">
          <div
            className="bg-blue-600 h-4 rounded-full transition-all"
            style={{ width: `${profileCompletion}%` }}
          />
        </div>
        <p className="text-sm font-medium text-gray-700 mt-1">
          {profileCompletion}%
        </p>
      </div>

      {/* Languages */}
      <div>
        <h3 className="text-xl font-bold text-[#1C274D] mb-2">Idiomas</h3>
        <div className="space-y-3">
          {languages.map((lang, index) => (
            <div key={index}>
              <div className="flex justify-between mb-1">
                <span className="font-medium text-[#1C274D]">{lang.name}</span>
                <span className="text-sm text-gray-700">{lang.level}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all"
                  style={{ width: `${lang.progress}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Stats */}
      <div>
        <h3 className="text-xl font-bold text-[#1C274D] mb-2">Estadísticas</h3>
        <ul className="space-y-2">
          {stats.map((stat, index) => (
            <li key={index} className="flex justify-between font-medium text-[#1C274D]">
              <span>{stat.label}</span>
              <span>{stat.value}</span>
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}


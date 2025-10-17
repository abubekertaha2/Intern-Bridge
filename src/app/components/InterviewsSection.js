"use client";
import React from "react";

export default function ApplicationsSection() {
  const applications = [
    {
      id: 1,
      position: "Frontend Developer",
      company: "TechNova Solutions",
      dateApplied: "2025-09-20",
      status: "Pending",
    },
    {
      id: 2,
      position: "UI/UX Designer",
      company: "Designify",
      dateApplied: "2025-09-12",
      status: "Interview",
    },
    {
      id: 3,
      position: "Backend Engineer",
      company: "DataCore Labs",
      dateApplied: "2025-09-05",
      status: "Accepted",
    },
  ];

  const statusColors = {
    Pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    Interview: "bg-blue-100 text-blue-800 border-blue-300",
    Accepted: "bg-green-100 text-green-800 border-green-300",
    Rejected: "bg-red-100 text-red-800 border-red-300",
  };

  return (
    <section className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
      <h2 className="text-2xl font-bold text-[#1C274D] mb-4">
        Aplicaciones de Trabajo
      </h2>

      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-200 rounded-lg">
          <thead className="bg-[#F4F7FB] text-[#1C274D]">
            <tr>
              <th className="text-left py-3 px-4 font-semibold">Puesto</th>
              <th className="text-left py-3 px-4 font-semibold">Empresa</th>
              <th className="text-left py-3 px-4 font-semibold">Fecha</th>
              <th className="text-left py-3 px-4 font-semibold">Estado</th>
            </tr>
          </thead>
          <tbody>
            {applications.map((app) => (
              <tr
                key={app.id}
                className="border-t hover:bg-gray-50 transition-colors"
              >
                <td className="py-3 px-4">{app.position}</td>
                <td className="py-3 px-4">{app.company}</td>
                <td className="py-3 px-4">
                  {new Date(app.dateApplied).toLocaleDateString()}
                </td>
                <td className="py-3 px-4">
                  <span
                    className={`px-3 py-1 text-sm rounded-full border font-medium ${
                      statusColors[app.status] || "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {app.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

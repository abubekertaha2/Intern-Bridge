"use client";
import React, { useState } from "react";
import Logo from "../branding/Logo.js";

export default function AuthLayout({ children }) {
  const [showFAQ, setShowFAQ] = useState(false);

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-[#1C274D] overflow-x-hidden relative">
      
      {/* Logo at top for small screens */}
      <div className="flex justify-center items-center py-6 lg:hidden">
        <Logo />
      </div>

      {/* Left side for large screens */}
      <div className="hidden lg:flex flex-col justify-end items-center p-8 w-1/2 bg-brand-dark text-brand-text relative">
        <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
          <Logo />
        </div>
        <div className="mb-10 text-center flex justify-end flex-col items-center px-4">
          <h1 className="text-xl text-[#FFFFFF] font-extrabold mb-3">
            Conecta tu futuro profesional
          </h1>
          <p className="text-base text-brand-subtle text-[#FFFFFF]">
            La plataforma líder que conecta estudiantes talentosos con las mejores oportunidades de prácticas profesionales.
          </p>
        </div>
      </div>

      {/* Right side / main content */}
      <main className="flex flex-1 justify-center items-center bg-gray-50 p-4 lg:p-6 overflow-y-auto relative">
        <div className="w-full max-w-md">
          {children}
          <div className="flex justify-end">
            <button
              onClick={() => setShowFAQ(true)}
              className="w-12 h-12 bg-[#1C274D] text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition duration-200 mt-3"
            >
              <span className="text-xl">?</span>
            </button>
          </div>
        </div>
      </main>

      {/* FAQ Modal */}
      {showFAQ && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-8 rounded-xl max-w-md w-full text-gray-800 shadow-xl">
            <h2 className="text-2xl font-bold mb-4 text-[#1C274D]">
              Preguntas Frecuentes
            </h2>
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="font-semibold text-[#1C274D]">¿Qué es PasantesRD?</h3>
                <p>
                  Es una plataforma que conecta estudiantes con oportunidades de
                  prácticas profesionales y empresas líderes.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1C274D]">¿Es gratuito registrarse?</h3>
                <p>Sí, el registro es completamente gratuito.</p>
              </div>
              <div>
                <h3 className="font-semibold text-[#1C274D]">¿Qué documentos necesito?</h3>
                <p>
                  Solo tu carnet estudiantil y la información básica solicitada.
                </p>
              </div>
            </div>

            <div className="mt-6 text-right">
              <button
                onClick={() => setShowFAQ(false)}
                className="bg-[#1C274D] text-white px-4 py-2 rounded-lg hover:bg-[#2A3A5F] transition duration-200"
              >
                Cerrar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

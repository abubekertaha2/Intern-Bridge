'use client'; 

import { useState } from 'react';
import Image from 'next/image'; 
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeButton, setActiveButton] = useState('estudiante'); 
  const router = useRouter();

  const handleUserSelection = (type) => {
    setActiveButton(type); 
    router.push(`/login?type=${type}`); 
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      
      {/* 1. Header Section (Left Side - Branding) */}
      {/* Reduced padding: p-8 md:p-16 -> p-6 md:p-10 */}
      <header className="flex flex-col justify-between items-center bg-[#1C274D] text-white p-6 md:p-10 flex-1 lg:max-w-[45%]">
        {/* Reduced margin: mb-8 -> mb-6 */}
        <div className="flex flex-col items-center mb-6 w-full">
          {/* LOGO RESTORED */}
          <div className="w-full max-w-[200px] h-auto rounded-lg flex items-center justify-center overflow-hidden mb-4">
            <Image
              src="/assets/logo.png"
              alt="PasantesRD Logo"
              width={200} // Set appropriate dimensions
              height={200} // Set appropriate dimensions
              className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          
          {/* Slightly reduced header text size for density */}
          <h1 className="font-extrabold text-3xl text-center md:text-4xl">PasantesRD</h1>
          <p className="text-base text-opacity-70 text-center">Conectando talento con oportunidades</p>
        </div>
        {/* Reduced margin: mt-8 -> mt-6 */}
        <div className="text-center mt-6">
          <h2 className="font-medium text-xl mb-3 md:text-2xl">Conecta tu futuro profesional</h2>
          <p className="text-base text-opacity-70">La plataforma líder que conecta estudiantes talentosos con las mejores oportunidades de prácticas profesionales.</p>
        </div>
      </header>

      {/* 2. Main Content Section (Right Side - Selector) */}
      {/* Reduced padding: p-8 md:p-16 -> p-6 md:p-10 */}
      <main className="flex flex-col justify-center items-center p-6 md:p-10 flex-1 lg:max-w-[55%]">
        <div className="w-full max-w-md">
          {/* Reduced margin: mb-10 -> mb-6 */}
          <div className="flex flex-col items-center mb-6 w-full">
            <h3 className="text-gray-700 font-extrabold text-2xl sm:text-3xl">¡Bienvenido!</h3>
            <p className="text-base text-opacity-70 text-gray-400">Tu futuro profesional comienza aquí</p>
          </div>
          
          {/* User Selection Buttons - Reduced gap (gap-4 -> gap-3) */}
          <div className="flex flex-col gap-3 w-full mb-8">
            <button
              className={`p-3 rounded-lg transition-all duration-300 w-full shadow-lg ${activeButton === 'estudiante' ? 'bg-[#1C274D] text-white' : 'bg-white text-[#1C274D] border-2 border-[#1C274D] hover:bg-gray-50'}`}
              onClick={() => handleUserSelection('estudiante')}
            >
              {/* Reduced text size: text-xl -> text-lg */}
              <span className="text-lg font-semibold">Estudiante</span>
            </button>
            <button
              className={`p-3 rounded-lg transition-all duration-300 w-full shadow-lg ${activeButton === 'empresa' ? 'bg-[#1C274D] text-white' : 'bg-white text-[#1C274D] border-2 border-[#1C274D] hover:bg-gray-50'}`}
              onClick={() => handleUserSelection('empresa')}
            >
              {/* Reduced text size: text-xl -> text-lg */}
              <span className="text-lg font-semibold">Empresa / Universidad</span>
            </button>
          </div>

          {/* Features Section - Reduced padding (p-8 -> p-6) and gap (gap-4 -> gap-3) */}
          <div className="bg-[#407DC3] rounded-xl p-6 flex flex-col gap-3 w-full shadow-xl">
            <h4 className="text-white text-lg font-bold mb-1">Beneficios Clave</h4>
            
            {/* Reduced text size: text-lg -> text-base */}
            <div className="flex items-center">
              {/* Consider slightly smaller icons if needed, but 40x40 is often fine */}
              <Image src="/assets/directorio.svg" alt="Directorio" width={32} height={32} /> 
              <p className="text-white text-base ml-2">Encuentra las mejores prácticas profesionales</p>
            </div>
            <div className="flex items-center">
              <Image src="/assets/maletin.svg" alt="Maletín" width={32} height={32} />
              <p className="text-white text-base ml-2">Conecta con empresas líderes</p>
            </div>
            <div className="flex items-center">
              <Image src="/assets/estrella-trofeo.svg" alt="Estrella Trofeo" width={32} height={32} />
              <p className="text-white text-base ml-2">Desarrolla tu carrera profesional</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
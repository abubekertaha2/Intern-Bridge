'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function Home() {
  const [activeButton, setActiveButton] = useState(null); 
  const router = useRouter();

  const handleUserSelection = (type) => {
    setActiveButton(type);
    localStorage.setItem('userRole', type);
    router.push(`/login?type=${type}`);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white">
      {/* Left Section */}
      <header className="flex flex-col justify-between items-center bg-[#1C274D] text-white p-6 md:p-10 flex-1 lg:max-w-[45%]">
        <div className="flex flex-col items-center mb-6 w-full">
          <div className="w-full max-w-[200px] h-auto rounded-lg flex items-center justify-center overflow-hidden mb-4">
            <Image
              src="/assets/logo.png"
              alt="PasantesRD Logo"
              width={200}
              height={200}
              className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-105"
            />
          </div>
          <h1 className="font-extrabold text-3xl text-center md:text-4xl">PasantesRD</h1>
          <p className="text-base text-opacity-70 text-center">
            Conectando talento con oportunidades
          </p>
        </div>

        <div className="text-center mt-6">
          <h2 className="font-medium text-xl mb-3 md:text-2xl">
            Conecta tu futuro profesional
          </h2>
          <p className="text-base text-opacity-70">
            La plataforma líder que conecta estudiantes talentosos con las mejores oportunidades de prácticas profesionales.
          </p>
        </div>
      </header>

      {/* Right Section */}
      <main className="flex flex-col justify-center items-center p-6 md:p-10 flex-1 lg:max-w-[55%]">
        <div className="w-full max-w-md">
          <div className="flex flex-col items-center mb-6 w-full">
            <h3 className="text-gray-700 font-extrabold text-2xl sm:text-3xl">¡Bienvenido!</h3>
            <p className="text-base text-opacity-70 text-gray-400">
              Tu futuro profesional comienza aquí
            </p>
          </div>

          <div className="flex flex-col gap-3 w-full mb-8">
            {/* Student button */}
            <button
              className={`p-3 rounded-lg transition-all duration-300 w-full shadow-lg border-2 ${
                activeButton === 'student'
                  ? 'bg-[#1C274D] text-white border-[#1C274D]'
                  : 'bg-white text-[#1C274D] border-[#1C274D] hover:bg-gray-50'
              }`}
              onClick={() => handleUserSelection('student')}
            >
              <span className="text-lg font-semibold">Estudiante</span>
            </button>

            {/* Company button */}
            <button
              className={`p-3 rounded-lg transition-all duration-300 w-full shadow-lg border-2 ${
                activeButton === 'company'
                  ? 'bg-[#1C274D] text-white border-[#1C274D]'
                  : 'bg-white text-[#1C274D] border-[#1C274D] hover:bg-gray-50'
              }`}
              onClick={() => handleUserSelection('company')}
            >
              <span className="text-lg font-semibold">Empresa</span>
            </button>
          </div>

          <div className="bg-[#407DC3] rounded-xl p-6 flex flex-col gap-3 w-full shadow-xl">
            <h4 className="text-white text-lg font-bold mb-1">Beneficios Clave</h4>
            <div className="flex items-center">
              <Image src="/assets/directorio.svg" alt="Directorio" width={32} height={32} />
              <p className="text-white text-base ml-2">
                Encuentra las mejores prácticas profesionales
              </p>
            </div>
            <div className="flex items-center">
              <Image src="/assets/maletin.svg" alt="Maletín" width={32} height={32} />
              <p className="text-white text-base ml-2">
                Conecta con empresas líderes
              </p>
            </div>
            <div className="flex items-center">
              <Image
                src="/assets/estrella-trofeo.svg"
                alt="Estrella Trofeo"
                width={32}
                height={32}
              />
              <p className="text-white text-base ml-2">
                Desarrolla tu carrera profesional
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

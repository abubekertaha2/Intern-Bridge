'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const mergeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const Dropdown = ({ options, placeholder, className, onChange }) => {
  const [selectedValue, setSelectedValue] = useState('');

  const handleSelect = (event) => {
    setSelectedValue(event.target.value);
    if (onChange) onChange(event.target.value);
  };

  return (
    <div className={mergeClasses("relative w-full", className)}>
      <select
        value={selectedValue}
        onChange={handleSelect}
        className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-gray-700 text-base appearance-none pr-8"
      >
        <option value="" disabled hidden>{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
          <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
        </svg>
      </div>
    </div>
  );
};

const InternshipCard = ({ internship }) => {
  const formatSalary = (salary) => {
    if (!salary) return 'No especificado';
    return `$${salary}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          {internship.company.logo && (
            <img 
              src={internship.company.logo} 
              alt={internship.company.name}
              className="w-12 h-12 rounded-lg object-cover"
            />
          )}
          <div>
            <h3 className="text-xl font-semibold text-[#1D2939]">{internship.title}</h3>
            <p className="text-gray-600">{internship.company.name}</p>
          </div>
        </div>
        {internship.company.verified && (
          <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
            Verificada
          </span>
        )}
      </div>
      
      <p className="text-gray-700 mb-4 line-clamp-2">{internship.description}</p>
      
      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span className="text-sm capitalize">{internship.modality}</span>
        </div>
        <div className="flex items-center gap-2 text-gray-600">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v1m0 6l-2.5 1.5M12 14l2.5 1.5M12 14v1m0-1v1m-2.5-1.5L7 14m2.5 1.5L7 16m2.5-1.5v1m0-1v1m5-1.5L17 14m-2.5 1.5L17 16m-2.5-1.5v1m0-1v1" />
          </svg>
          <span className="text-sm">{formatSalary(internship.salary)}</span>
        </div>
      </div>
      
      <Link href={`/internship_search/${internship.id}`}>
        <button className="w-full bg-[#1D2939] text-white py-2 rounded-md hover:bg-gray-700 transition-colors">
          Ver Detalles
        </button>
      </Link>
    </div>
  );
};

const App = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [province, setProvince] = useState('');
  const [modality, setModality] = useState('');
  const [journey, setJourney] = useState('');
  const [sector, setSector] = useState('');
  const [internships, setInternships] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (province && province !== 'all') params.append('location', province);
      if (modality && modality !== 'all') params.append('modality', modality);
      if (journey && journey !== 'all') params.append('journey', journey);
      if (sector && sector !== 'all') params.append('sector', sector);
      
      const response = await fetch(`/api/internships?${params}`);
      const result = await response.json();
      
      if (result.success) {
        setInternships(result.data.internships);
      } else {
        console.error('Search failed:', result.error);
        setInternships([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setInternships([]);
    } finally {
      setLoading(false);
    }
  };

  const provinceOptions = [
    { label: 'Todas las provincias', value: 'all' },
    { label: 'Azuay', value: 'azuay' },
    { label: 'Guayas', value: 'guayas' },
  ];
  const modalityOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Presencial', value: 'presencial' },
    { label: 'Remoto', value: 'remoto' },
  ];
  const journeyOptions = [
    { label: 'Todas', value: 'all' },
    { label: 'Tiempo Completo', value: 'full-time' },
    { label: 'Medio Tiempo', value: 'part-time' },
  ];
  const sectorOptions = [
    { label: 'Todos los sectores', value: 'all' },
    { label: 'Tecnología', value: 'tech' },
    { label: 'Finanzas', value: 'finance' },
    { label: 'Ventas', value: 'sales' },
  ];

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1D2939] font-sans">
     
      <header className="bg-[#1D2950] text-white py-4 px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
                src="/assets/logo.png"
                alt="Logo"
                width={100}
                height={100}
                className="object-contain "
            />
          </div> 
          <nav className="flex items-center space-x-6">
            <Link href="/" className="hover:text-blue-300">Inicio</Link>
            <Link href="/internship_search" className="hover:text-blue-300">Pasantías</Link>
            <Link href="/company_directory" className="hover:text-blue-300">Empresas</Link>
            <Link href="#" className="hover:text-blue-300">Contacto</Link>
            <button className="bg-[#DB1320] text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
              Mi Perfil
            </button>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-12 px-8">
       
        <section className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-[#1D2939] mb-4 leading-tight">
            Encuentra tu Práctica Ideal
          </h1>
          <p className="text-lg text-gray-600">
            Conectamos estudiantes talentosos con las mejores oportunidades de prácticas profesionales
          </p>
        </section>

       
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          <div className="bg-[#CFE5FF] p-6 rounded-lg shadow-md text-center">
            <h2 className="text-5xl font-extrabold text-[#1D2939] mb-2">2</h2>
            <p className="text-lg text-gray-600">Prácticas Disponibles</p>
          </div>
          <div className="bg-[#CFE5FF] p-6 rounded-lg shadow-md text-center">
            <h2 className="text-5xl font-extrabold text-[#1D2939] mb-2">15</h2>
            <p className="text-lg text-gray-600">Empresas Activas</p>
          </div>
          <div className="bg-[#CFE5FF] p-6 rounded-lg shadow-md text-center">
            <h2 className="text-5xl font-extrabold text-[#1D2939] mb-2">87</h2>
            <p className="text-lg text-gray-600">Estudiantes Registrados</p>
          </div>
          <div className="bg-[#CFE5FF]  p-6 rounded-lg shadow-md text-center">
            <h2 className="text-5xl font-extrabold text-[#1D2939] mb-2">23</h2>
            <p className="text-lg text-gray-600">Colocaciones Exitosas</p>
          </div>
        </section>

        
        <section className="mb-12">
          <div className="bg-[#CFE5FF]  rounded-lg shadow-md p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="text"
                placeholder="Buscar cargo, empresa o tecnología"
                className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
              />
              <button
                className="bg-[#1D2939] text-white px-6 py-3 rounded-md text-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
                onClick={handleSearch}
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    Buscando...
                  </>
                ) : (
                  <>
                    Buscar
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </>
                )}
              </button>
            </div>
          </div>
        </section>

        <section className="bg-[#CFE5FF]  rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-[#1D2939] mb-6 flex items-center gap-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-blue-600"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            Filtros de Búsqueda
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Dropdown
              options={provinceOptions}
              placeholder="Todas las provincias"
              onChange={setProvince}
            />
            <Dropdown
              options={modalityOptions}
              placeholder="Todas"
              onChange={setModality}
            />
            <Dropdown
              options={journeyOptions}
              placeholder="Todas"
              onChange={setJourney}
            />
            <Dropdown
              options={sectorOptions}
              placeholder="Todos los sectores"
              onChange={setSector}
            />
          </div>
        </section>

        <section className="mt-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-bold text-[#1D2939]">
              {internships.length} Pasantías Encontradas
            </h3>
            {loading && (
              <div className="flex items-center gap-2 text-gray-600">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                Buscando...
              </div>
            )}
          </div>

          {internships.length === 0 && !loading ? (
            <div className="text-center py-12">
              <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="mt-2 text-lg font-medium text-gray-900">No se encontraron pasantías</h3>
              <p className="mt-1 text-gray-500">Intenta ajustar tus filtros de búsqueda</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {internships.map((internship) => (
                <InternshipCard key={internship.id} internship={internship} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default App;
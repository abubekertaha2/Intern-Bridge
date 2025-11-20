'use client';
import Image from 'next/image';
import React, { useState } from 'react';

const mergeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.691h4.168c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.176 0l-3.376 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.096 9.385c-.783-.57-.381-1.81.588-1.81h4.168a1 1 0 00.95-.691l1.286-3.957z" />
  </svg>
);

const TabButton = ({ id, label, activeTab, setActiveTab, position }) => {
  const isActive = activeTab === id;

  const cornerClass =
    position === 'left'
      ? 'rounded-l-md'
      : position === 'right'
      ? 'rounded-r-md'
      : 'rounded-none';

  const separatorClass = position !== 'right' ? 'border-r border-[#1C274D]' : '';

  return (
    <button
      onClick={() => setActiveTab(id)}
      type="button"
      className={mergeClasses(
        'px-6 py-2 text-sm font-semibold transition-colors duration-150 whitespace-nowrap flex items-center justify-center',
        cornerClass,
        separatorClass,
        isActive
          ? 'bg-[#1C274D] text-white'
          : 'bg-white text-[#1C274D] hover:bg-[#E8F2FF]'
      )}
    >
      {label}
    </button>
  );
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
        className="block w-full px-4 py-3 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-[#1D2939] focus:border-[#1D2939] text-gray-700 text-base appearance-none pr-8"
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

const CardBase = ({ item, icon, details, rating, buttonLabel }) => (
  <div className="bg-white p-6 rounded-lg shadow-md flex items-start gap-4 hover:shadow-xl transition-shadow duration-300">
    {/* Icon */}
    <div className="bg-[#1D2939] p-3 rounded-md flex-shrink-0">
      {icon}
    </div>

    <div className="flex-grow">
      <h3 className="text-xl font-bold text-[#1D2939]">{item.name}</h3>
      <p className="text-sm text-gray-500 mb-2">{item.category} • {item.subCategory}</p>
      
      {/* Specific label */}
      <div className="inline-block bg-[#CFE5FF] text-[#1D2939] font-semibold text-xs px-2 py-1 rounded-full mb-3">
        {details}
      </div>

      <div className="flex items-center text-sm text-gray-500">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-red-500 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        {item.location}
      </div>
    </div>

    {/* Rating and Button */}
    <div className="flex flex-col items-end justify-between h-full">
      <div className="flex items-center gap-1 text-sm font-semibold text-gray-700 mb-4">
        {[...Array(5)].map((_, i) => (
          <StarIcon key={i} />
        ))}
        {rating}
      </div>
      <button className="bg-[#DB1320] text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors text-sm whitespace-nowrap">
        {buttonLabel}
      </button>
    </div>
  </div>
);

const CompanyCard = ({ company }) => (
  <CardBase
    item={company}
    icon={
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 13.255A23.531 23.531 0 0112 15c-3.18 0-6.248-.62-9-1.745M21 14.5a3 3 0 000-6V7a3 3 0 00-3-3H6a3 3 0 00-3 3v1.5a3 3 0 000 6V17a3 3 0 003 3h12a3 3 0 003-3v-2.5z" />
      </svg>
    }
    details={`${company.activeInternships} prácticas activas`}
    rating={company.rating}
    buttonLabel="Ver Perfil Completo"
  />
);

const CourseCard = ({ course }) => (
  <CardBase
    item={course}
    icon={
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.206 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.832 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.832 5 16.5 5s3.332.477 4.5 1.253v13C19.832 18.477 18.168 18 16.5 18s-3.332.477-4.5 1.253" />
      </svg>
    }
    details={course.duration}
    rating={course.rating}
    buttonLabel="Ver Detalles del Curso"
  />
);

const TrainingCard = ({ program }) => (
  <CardBase
    item={program}
    icon={
      <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path d="M12 14l9-5-9-5-9 5 9 5z" />
        <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055v-6.055z" />
        <path d="M11.984 14.734l-6.16-3.422a12.083 12.083 0 00-.665 6.479A11.952 11.952 0 0112 20.055v-5.321z" />
      </svg>
    }
    details={program.certified}
    rating={program.rating}
    buttonLabel="Solicitar Información"
  />
);

const companyData = [
  { name: 'TechInnovate Solutions', category: 'Tecnología', subCategory: 'Desarrollo de Software', activeInternships: 5, rating: 4.8, location: 'Madrid, España' },
  { name: 'FinanceMax Corp', category: 'Finanzas', subCategory: 'Consultoría', activeInternships: 3, rating: 4.6, location: 'Barcelona, España' },
  { name: 'Digital Marketing Pro', category: 'Marketing', subCategory: 'Publicidad Digital', activeInternships: 7, rating: 4.9, location: 'Madrid, España' },
  { name: 'HealthCare Systems', category: 'Salud', subCategory: 'Tecnología Médica', activeInternships: 4, rating: 4.7, location: 'Sevilla, España' },
];

const coursesData = [
  { name: 'Introducción a React', category: 'Desarrollo Web', subCategory: 'Frontend', duration: '40 Horas', rating: 4.7, location: 'Remoto' },
  { name: 'Análisis de Datos con Python', category: 'Ciencia de Datos', subCategory: 'Programación', duration: '60 Horas', rating: 4.9, location: 'Presencial' },
  { name: 'Diseño UX/UI Avanzado', category: 'Diseño', subCategory: 'Experiencia de Usuario', duration: '30 Horas', rating: 4.6, location: 'Remoto' },
];

const trainingData = [
  { name: 'Full Stack Bootcamp', category: 'Tecnología', subCategory: 'Desarrollo', certified: 'Certificado Pro', rating: 4.9, location: 'Barcelona, España' },
  { name: 'Máster en Ciberseguridad', category: 'Seguridad', subCategory: 'IT', certified: 'Título Universitario', rating: 4.8, location: 'Madrid, España' },
];

const App = () => {
  const [activeTab, setActiveTab] = useState('empresa'); 
  const [searchTerm, setSearchTerm] = useState('');
  
  const [filter1, setFilter1] = useState('all');
  const [filter2, setFilter2] = useState('all');
  const [filter3, setFilter3] = useState('all');
  const [filter4, setFilter4] = useState('all');
  

  const handleSearch = () => {
    console.log(`Buscando en ${activeTab}:`, searchTerm);
    console.log("Filtros:", { filter1, filter2, filter3, filter4 });
   
  };
  


  const getFilterLabels = () => {
    switch (activeTab) {
      case 'empresa':
        return {
          title: "Filtros de Búsqueda de Empresas",
          f1: { label: 'Sector', options: [{ label: 'Todos los sectores', value: 'all' }, { label: 'Tecnología', value: 'tech' }, { label: 'Finanzas', value: 'finance' }], placeholder: 'Todos los sectores' },
          f2: { label: 'Tamaño de la empresa', options: [{ label: 'Todos los tamaños', value: 'all' }, { label: 'Pequeña (1-50)', value: 'small' }, { label: 'Grande (+500)', value: 'large' }], placeholder: 'Todos los tamaños' },
          f3: { label: 'Provincias', options: [{ label: 'Todas las provincias', value: 'all' }, { label: 'Madrid, España', value: 'madrid' }, { label: 'Barcelona, España', value: 'barcelona' }], placeholder: 'Todas las provincias' },
          f4: { label: 'Modalidad', options: [{ label: 'Todas las modalidades', value: 'all' }, { label: 'Presencial', value: 'presencial' }, { label: 'Remoto', value: 'remoto' }], placeholder: 'Todas las modalidades' },
        };
      case 'cursos':
        return {
          title: "Filtros de Búsqueda de Cursos",
          f1: { label: 'Categoría', options: [{ label: 'Todas las categorías', value: 'all' }, { label: 'Programación', value: 'prog' }, { label: 'Diseño', value: 'design' }], placeholder: 'Todas las categorías' },
          f2: { label: 'Duración', options: [{ label: 'Cualquier duración', value: 'all' }, { label: 'Menos de 20h', value: 'short' }, { label: 'Más de 40h', value: 'long' }], placeholder: 'Cualquier duración' },
          f3: { label: 'Nivel', options: [{ label: 'Todos los niveles', value: 'all' }, { label: 'Básico', value: 'basic' }, { label: 'Avanzado', value: 'adv' }], placeholder: 'Todos los niveles' },
          f4: { label: 'Modalidad', options: [{ label: 'Todas las modalidades', value: 'all' }, { label: 'Online', value: 'online' }, { label: 'En Vivo', value: 'live' }], placeholder: 'Todas las modalidades' },
        };
      case 'formacion':
        return {
          title: "Filtros de Programas de Formación",
          f1: { label: 'Área', options: [{ label: 'Todas las áreas', value: 'all' }, { label: 'Máster', value: 'master' }, { label: 'Bootcamp', value: 'bootcamp' }], placeholder: 'Todas las áreas' },
          f2: { label: 'Certificación', options: [{ label: 'Cualquier certificado', value: 'all' }, { label: 'Oficial', value: 'official' }, { label: 'Universitario', value: 'uni' }], placeholder: 'Cualquier certificado' },
          f3: { label: 'Ubicación', options: [{ label: 'Cualquier ubicación', value: 'all' }, { label: 'Nacional', value: 'nat' }, { label: 'Internacional', value: 'int' }], placeholder: 'Cualquier ubicación' },
          f4: { label: 'Jornada', options: [{ label: 'Cualquier jornada', value: 'all' }, { label: 'Tiempo Completo', value: 'ft' }, { label: 'Fin de Semana', value: 'wknd' }], placeholder: 'Cualquier jornada' },
        };
      default:
        return {};
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'empresa':
        return (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {companyData.map((company, index) => (
              <CompanyCard key={index} company={company} />
            ))}
          </section>
        );
      case 'cursos':
        return (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {coursesData.map((course, index) => (
              <CourseCard key={index} course={course} />
            ))}
          </section>
        );
      case 'formacion':
        return (
          <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {trainingData.map((program, index) => (
              <TrainingCard key={index} program={program} />
            ))}
          </section>
        );
      default:
        return <p className="text-center text-gray-500 py-12">Selecciona una pestaña para comenzar la búsqueda.</p>;
    }
  };

  const filterLabels = getFilterLabels();

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
            <a href="/" className="hover:text-blue-300">Inicio</a>
            <a href="internship_search" className="hover:text-blue-300">Pasantías</a>
            <a href="company_directory" className="hover:text-blue-300">Empresas</a>
            <a href="contact" className="hover:text-blue-300">Contacto</a>
            <a href="institution_profile">
                <button className="bg-[#DB1320] cursor-pointer text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors">
                  Mi Perfil
                </button>
            </a>
          </nav>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-10 px-8">
        
        {/* Hero Section */}
        <section className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-extrabold text-[#1D2939] mb-3">
            {activeTab === 'empresa' && 'Directorio de Empresas'}
            {activeTab === 'cursos' && 'Catálogo de Cursos'}
            {activeTab === 'formacion' && 'Programas de Formación'}
          </h1>
          <p className="text-lg text-gray-600">
            {activeTab === 'empresa' && 'Descubre las mejores empresas que ofrecen prácticas profesionales'}
            {activeTab === 'cursos' && 'Encuentra cursos cortos para mejorar tus habilidades técnicas'}
            {activeTab === 'formacion' && 'Explora bootcamps y másters para una carrera completa'}
          </p>
        </section>

        {/* Search and Tabs Container */}
        <section className="bg-white p-6 rounded-xl shadow-2xl mb-12">
          
          {/* Tabs */}
          <div className="flex justify-center mb-6 border-b border-gray-200 overflow-x-auto bg-[#CFE5FF]">
            {/* Updated Tab Buttons with new styling and separators */}
            <div className="inline-flex items-center rounded-md border border-[#1C274D] bg-white overflow-hidden">
              <TabButton id="empresa" label="Empresa" activeTab={activeTab} setActiveTab={setActiveTab} position="left" />
              <TabButton id="cursos" label="Cursos" activeTab={activeTab} setActiveTab={setActiveTab} position="middle" />
              <TabButton id="formacion" label="Formación" activeTab={activeTab} setActiveTab={setActiveTab} position="right" />
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex flex-col gap-4">
            <input
              type="text"
              placeholder={`Buscar ${activeTab === 'empresa' ? 'empresa, sector o tecnología' : activeTab === 'cursos' ? 'nombre del curso, tecnología o proveedor' : 'programa, máster o institución'}`}
              className="flex-grow px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 text-lg"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button
              className="bg-[#1D2939] text-white px-6 py-3 rounded-md text-lg font-medium flex items-center justify-center gap-2 hover:bg-gray-700 transition-colors"
              onClick={handleSearch}
            >
              Buscar
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 ml-2"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </button>
          </div>
        </section>

        {/* Filter Section - Dynamic Filters */}
        <section className="bg-[#CFE5FF]/70 backdrop-blur-sm rounded-xl shadow-xl p-6 mb-12 border border-[#CFE5FF]">
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
            {filterLabels.title}
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{filterLabels.f1.label}</label>
                <Dropdown
                    options={filterLabels.f1.options}
                    placeholder={filterLabels.f1.placeholder}
                    onChange={setFilter1}
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{filterLabels.f2.label}</label>
                <Dropdown
                    options={filterLabels.f2.options}
                    placeholder={filterLabels.f2.placeholder}
                    onChange={setFilter2}
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{filterLabels.f3.label}</label>
                <Dropdown
                    options={filterLabels.f3.options}
                    placeholder={filterLabels.f3.placeholder}
                    onChange={setFilter3}
                />
            </div>
            <div>
                <label className="text-sm font-medium text-gray-700 block mb-1">{filterLabels.f4.label}</label>
                <Dropdown
                    options={filterLabels.f4.options}
                    placeholder={filterLabels.f4.placeholder}
                    onChange={setFilter4}
                />
            </div>
          </div>
        </section>
        
        {/* Dynamic Content Listings */}
        {renderTabContent()}

      </main>
    </div>
  );
};

export default App;

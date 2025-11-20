'use client';
import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle, User, AlertCircle } from 'lucide-react';

const InternshipDetail = () => {
  const params = useParams();
  const internshipId = params.id;

  const [internship, setInternship] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hasApplied, setHasApplied] = useState(false);
  const [isOwner, setIsOwner] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [applying, setApplying] = useState(false);

  useEffect(() => {
    checkAuthStatus();
    fetchInternship();
  }, [internshipId]);

  const checkAuthStatus = () => {
    if (typeof window !== 'undefined') {
      const studentId = localStorage.getItem('currentUserId');
      const companyId = localStorage.getItem('companyId');
      const role = localStorage.getItem('userRole');
      
      setIsLoggedIn(!!studentId || !!companyId);
      setUserRole(role || '');
    }
  };

  const fetchInternship = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/internships/${internshipId}`);
      const result = await response.json();

      if (result.success) {
        setInternship(result.data);
        checkApplicationStatus(result.data);
        checkOwnership(result.data);
      } else {
        setError(result.error || 'Failed to fetch internship');
      }
    } catch (err) {
      setError('Error loading internship details');
      console.error('Fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  const checkApplicationStatus = async (internshipData) => {
    if (!isLoggedIn || userRole !== 'student') return;

    const studentId = localStorage.getItem('currentUserId');
    try {
      const response = await fetch(
        `/api/applications/check?student_id=${studentId}&internship_id=${internshipId}`
      );
      const result = await response.json();
      setHasApplied(result.applied || false);
    } catch (err) {
      console.error('Error checking application status:', err);
    }
  };

  const checkOwnership = (internshipData) => {
    if (!isLoggedIn || userRole !== 'company') return;

    const companyId = localStorage.getItem('companyId');
    if (companyId && internshipData.company_id === companyId) {
      setIsOwner(true);
    }
  };

  const handleApply = async () => {
    if (!isLoggedIn) {
      alert('Por favor inicia sesión como estudiante para aplicar');
      return;
    }

    if (userRole !== 'student') {
      alert('Solo los estudiantes pueden aplicar a pasantías');
      return;
    }

    if (isOwner) {
      alert('No puedes aplicar a tu propia pasantía');
      return;
    }

    if (hasApplied) {
      alert('Ya has aplicado a esta pasantía');
      return;
    }

    // Confirm application
    if (!confirm('¿Estás seguro de que quieres aplicar a esta pasantía?')) {
      return;
    }

    await submitApplication();
  };

  const submitApplication = async () => {
    const studentId = localStorage.getItem('currentUserId');
    
    if (!studentId) {
      alert('Error: ID de estudiante no encontrado');
      return;
    }

    setApplying(true);
    try {
      const response = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          student_id: studentId,
          internship_id: internshipId
        })
      });

      const result = await response.json();

      if (response.ok) {
        setHasApplied(true);
        alert('¡Aplicación enviada con éxito!');
        
        // Trigger notification refresh
        if (window.updateStudentNotifications) {
          window.updateStudentNotifications();
        }
      } else {
        alert(result.error || 'Error al enviar la aplicación');
      }
    } catch (err) {
      alert('Error de conexión. Por favor intenta nuevamente.');
      console.error('Application error:', err);
    } finally {
      setApplying(false);
    }
  };

  const formatSalary = (salary) => {
    if (!salary) return 'No especificado';
    return `$${parseInt(salary).toLocaleString()}`;
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'No especificada';
    return new Date(dateString).toLocaleDateString('es-ES');
  };

  // Render Apply Button based on conditions
  const renderApplyButton = () => {
    if (!isLoggedIn) {
      return (
        <Link
          href="/login"
          className="w-full bg-[#DB1320] text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors text-center block"
        >
          Iniciar Sesión para Aplicar
        </Link>
      );
    }

    if (userRole !== 'student') {
      return (
        <button 
          disabled
          className="w-full bg-gray-400 text-white py-3 rounded-md font-semibold cursor-not-allowed"
        >
          Solo para Estudiantes
        </button>
      );
    }

    if (isOwner) {
      return (
        <button 
          disabled
          className="w-full bg-gray-400 text-white py-3 rounded-md font-semibold cursor-not-allowed"
        >
          Tu Pasantía
        </button>
      );
    }

    if (hasApplied) {
      return (
        <button 
          disabled
          className="w-full bg-green-600 text-white py-3 rounded-md font-semibold flex items-center justify-center space-x-2 cursor-not-allowed"
        >
          <CheckCircle className="w-5 h-5" />
          <span>¡Ya Aplicaste!</span>
        </button>
      );
    }

    return (
      <button 
        onClick={handleApply}
        disabled={applying}
        className="w-full bg-[#DB1320] text-white py-3 rounded-md font-semibold hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
      >
        {applying ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            <span>Aplicando...</span>
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            <span>Aplicar Ahora</span>
          </>
        )}
      </button>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando detalles de la pasantía...</p>
        </div>
      </div>
    );
  }

  if (error || !internship) {
    return (
      <div className="min-h-screen bg-[#F0F2F5] flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-lg font-medium text-gray-900">Error</h3>
          <p className="mt-1 text-gray-500">{error || 'Pasantía no encontrada'}</p>
          <Link
            href="/internship_search"
            className="mt-4 inline-block bg-[#1D2939] text-white px-4 py-2 rounded-md hover:bg-gray-700"
          >
            Volver a Búsqueda
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F0F2F5] text-[#1D2939]">
      {/* Header */}
      <header className="bg-[#1D2950] text-white py-4 px-8 shadow-md">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Image
              src="/assets/logo.png"
              alt="Logo"
              width={100}
              height={100}
              className="object-contain"
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

      <main className="max-w-4xl mx-auto py-8 px-4">
        {/* Back Button */}
        <Link
          href="/internship_search"
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Volver a la búsqueda
        </Link>

        {/* Internship Header */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center gap-4">
              {internship.company?.logo && (
                <img
                  src={internship.company.logo}
                  alt={internship.company.name}
                  className="w-16 h-16 rounded-lg object-cover"
                />
              )}
              <div>
                <h1 className="text-3xl font-bold text-[#1D2939]">{internship.title}</h1>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-xl text-gray-600">{internship.company?.name}</p>
                  {internship.company?.verified && (
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                      Empresa Verificada
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-t border-gray-200">
            <div>
              <p className="text-sm text-gray-500">Modalidad</p>
              <p className="font-medium capitalize">{internship.modality}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Ubicación</p>
              <p className="font-medium">{internship.location}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Salario</p>
              <p className="font-medium">{formatSalary(internship.salary)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-500">Duración</p>
              <p className="font-medium">{internship.duration || 'No especificada'}</p>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-bold text-[#1D2939] mb-4">Descripción del Puesto</h2>
              <p className="text-gray-700 whitespace-pre-line">{internship.description}</p>
            </div>

            {internship.requirements && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#1D2939] mb-4">Requisitos</h2>
                <p className="text-gray-700 whitespace-pre-line">{internship.requirements}</p>
              </div>
            )}

            {internship.benefits && internship.benefits.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-bold text-[#1D2939] mb-4">Beneficios</h2>
                <ul className="list-disc list-inside space-y-2 text-gray-700">
                  {internship.benefits.map((benefit, index) => (
                    <li key={index}>{benefit}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-[#1D2939] mb-4">Sobre la Empresa</h3>
              <div className="flex items-center gap-3 mb-4">
                {internship.company?.logo && (
                  <img
                    src={internship.company.logo}
                    alt={internship.company.name}
                    className="w-12 h-12 rounded-lg object-cover"
                  />
                )}
                <div>
                  <p className="font-semibold">{internship.company?.name}</p>
                  <p className="text-sm text-gray-600">{internship.company?.industry}</p>
                </div>
              </div>
              <Link
                href={`/student/student_view?companyId=${internship.company?.id}`}
                className="block w-full text-center bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200 transition-colors"
              >
                Ver Perfil de la Empresa
              </Link>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-bold text-[#1D2939] mb-4">Postular a esta Pasantía</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Fecha límite:</span>
                  <span className="font-medium">{formatDate(internship.application_deadline)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Tipo de jornada:</span>
                  <span className="font-medium capitalize">{internship.journey}</span>
                </div>
                
                {/* Application Status */}
                {hasApplied && (
                  <div className="bg-green-50 border border-green-200 rounded-md p-3 mt-4">
                    <div className="flex items-center space-x-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">¡Ya aplicaste exitosamente!</span>
                    </div>
                    <p className="text-xs text-green-600 mt-1">
                      La empresa será notificada de tu aplicación
                    </p>
                  </div>
                )}
              </div>

              {renderApplyButton()}

              <p className="text-xs text-gray-500 text-center mt-3">
                {!isLoggedIn 
                  ? 'Inicia sesión como estudiante para aplicar' 
                  : hasApplied 
                    ? 'Tu aplicación está siendo revisada por la empresa' 
                    : 'Haz clic para aplicar a esta pasantía'
                }
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default InternshipDetail;
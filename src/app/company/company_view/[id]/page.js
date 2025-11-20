'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import ProfileLayout from '@/components/layout/ProfileLayout'; // Use alias
import { 
  FileText, 
  Globe, 
  CheckCircle, 
  Mail,
  GraduationCap,
  Briefcase,
  User
} from 'lucide-react';

const Badge = ({ className = "", children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
    {children}
  </span>
);

// Company View Component - Read Only
const CompanyStudentProfile = ({ student }) => {
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.split(' ').filter(p => p.length > 0);
    if (parts.length >= 2) {
      return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
    }
    return name.charAt(0).toUpperCase();
  };

  const initials = getInitials(student?.full_name);

  const formatGPA = (gpa) => {
    const num = typeof gpa === 'number' ? gpa : parseFloat(gpa || 0);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  const formatSemester = (semester) => {
    const num = typeof semester === 'number' ? semester : parseInt(semester || 0);
    return isNaN(num) ? '0' : num.toString();
  };

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-2xl"> 
      {/* Header - Read Only */}
      <div className="bg-[#407dc3] px-6 py-8 text-white">
        <div className="flex items-center gap-4">
          {student?.profile_image_url ? (
            <img
              src={student.profile_image_url}
              alt={student.full_name}
              className="w-24 h-24 rounded-full object-cover border-4 border-white"
              onError={(e) => {
                e.target.style.display = 'none';
                const initialsDiv = e.target.nextElementSibling;
                if (initialsDiv) initialsDiv.style.display = 'flex';
              }}
            />
          ) : null}
          <div 
            className={`w-24 h-24 rounded-full bg-[#cfe5ff] flex items-center justify-center flex-shrink-0 border-4 border-white ${
              student?.profile_image_url ? 'hidden' : 'flex'
            }`}
          >
            <span className="text-[#407dc3] text-3xl font-bold">{initials}</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold">
              {student?.full_name || 'Nombre no disponible'}
            </h1>
            <p className="text-[#cfe5ff] text-lg">
              {student?.career || 'Carrera no especificada'} | {student?.university || 'Universidad no especificada'}
            </p>
            <Badge className="bg-[#1c274d] text-white text-xs mt-2">Perfil Verificado</Badge>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        <div className="lg:col-span-2 space-y-6">
          {/* Información Personal - Read Only */}
          <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-[#1c274d] flex items-center gap-2 mb-4">
              <User className="w-5 h-5 text-[#407dc3]" />
              Información Personal
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#787878] text-xs">Correo electrónico (Principal)</p>
                <p className="text-[#1c274d] font-medium">{student?.email || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-[#787878] text-xs">Correo electrónico (Opcional)</p>
                <p className="text-[#1c274d] font-medium">{student?.optional_email || 'N/A'}</p>
              </div>
              <div>
                <p className="text-[#787878] text-xs">Teléfono</p>
                <p className="text-[#1c274d] font-medium">{student?.phone || 'No especificado'}</p>
              </div>
              <div>
                <p className="text-[#787878] text-xs">Año Académico</p>
                <p className="text-[#1c274d] font-medium">{formatSemester(student?.semester)}º Curso</p>
              </div>
            </div>
          </div>

          {/* Información Académica - Read Only */}
          <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-[#1c274d] flex items-center gap-2 mb-4">
              <GraduationCap className="w-5 h-5 text-[#407dc3]" />
              Información Académica
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-[#787878] text-xs">Universidad</p>
                <p className="text-[#1c274d] font-medium">{student?.university || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-[#787878] text-xs">Carrera</p>
                <p className="text-[#1c274d] font-medium">{student?.career || 'No especificada'}</p>
              </div>
              <div>
                <p className="text-[#787878] text-xs">Promedio (GPA)</p>
                <p className="text-[#1c274d] font-medium">{formatGPA(student?.gpa)} / 10</p>
              </div>
              <div>
                <p className="text-[#787878] text-xs">Fecha de Graduación</p>
                <p className="text-[#1c274d] font-medium">Junio 2025</p>
              </div>
            </div>
          </div>

          {/* Habilidades y Competencias - Read Only */}
          <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-[#1c274d] flex items-center gap-2 mb-4">
              <Briefcase className="w-5 h-5 text-[#407dc3]" />
              Habilidades y Competencias
            </h2>
            <div className="flex flex-wrap gap-2">
              {student?.skills?.map((skill, index) => (
                <Badge key={index} className="bg-[#407dc3] text-white text-xs">
                  {typeof skill === 'object' ? skill.name || skill.skill : skill}
                </Badge>
              )) || (
                <p className="text-[#787878] text-sm">No se han especificado habilidades</p>
              )}
            </div>
          </div>

          {/* Documents - Read Only */}
          <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
            <h2 className="font-semibold text-[#1c274d] flex items-center gap-2 mb-4">
              <FileText className="w-5 h-5 text-[#407dc3]" />
              Documentos
            </h2>
            <div className="space-y-3">
              <div className="bg-[#cfe5ff] rounded p-3 flex items-center justify-between shadow-inner">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-[#407dc3] flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-[#1c274d]">
                      {student?.student_card || 'No hay documento cargado'}
                    </p>
                    <p className="text-xs text-[#787878]">1.3 MB • Verificado ✓</p>
                  </div>
                </div>
              </div>
              
              {/* CV Section - Company can see if CV is uploaded */}
              <div className="bg-green-50 border border-green-200 rounded p-3">
                <div className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-green-800">CV del Estudiante</p>
                    <p className="text-xs text-green-600">Disponible para revisión ✓</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        
        <div className="space-y-6">
          {/* Profile Status */}
          <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-[#1c274d] text-sm mb-3">Estado del Perfil</h3>
            <div className="space-y-2 text-xs">
              <p className="text-[#1c274d] flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="font-bold">Perfil Completo</span>
              </p>
              <p className="text-[#1c274d] flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="font-bold">Documentos Verificados</span>
              </p>
              <p className="text-[#1c274d] flex items-center gap-1">
                <CheckCircle className="w-3 h-3 text-green-500" />
                <span className="font-bold">Disponible para entrevistas</span>
              </p>
            </div>
          </div>

          {/* Idiomas */}
          <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-[#1c274d] text-sm mb-3 flex items-center gap-2">
              <Globe className="w-4 h-4 text-[#407dc3]" />
              Idiomas
            </h3>
            <div className="space-y-2 text-xs">
              {student?.languages?.map((lang, index) => (
                <div key={index} className="flex justify-between items-center">
                  <span className="text-[#1c274d] font-medium">
                    {typeof lang === 'object' ? lang.language || lang.name : lang}
                  </span>
                  <span className="text-[#787878]">
                    {typeof lang === 'object' ? lang.level : 'N/A'}
                  </span>
                </div>
              )) || (
                <p className="text-[#787878]">No se han especificado idiomas</p>
              )}
            </div>
          </div>

          {/* Contact Action Button */}
          <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
            <h3 className="font-semibold text-[#1c274d] text-sm mb-3">Contactar Estudiante</h3>
            <button 
              onClick={() => window.location.href = `mailto:${student?.email}`}
              className="w-full bg-[#407dc3] text-white py-2 px-4 rounded-lg font-medium hover:bg-[#346da6] transition-colors"
            >
              <Mail className="w-4 h-4 inline mr-2" />
              Enviar Mensaje
            </button>
            <p className="text-xs text-[#787878] mt-2 text-center">
              El estudiante será notificado de tu interés
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Main Page Component
export default function CompanyStudentViewPage() {
  const params = useParams();
  const [student, setStudent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudentData = async (id) => {
      try {
        setIsLoading(true);
        setError(null);
        
        const response = await fetch(`/api/company_view/${id}`);
        
        if (!response.ok) {
          throw new Error('Student not found');
        }
        
        const studentData = await response.json();
        setStudent(studentData);
      } catch (error) {
        console.error('Error fetching student for company view:', error);
        setError(error.message);
        setStudent(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (params.id) {
      fetchStudentData(params.id);
    }
  }, [params.id]);

  // Debug student data
  useEffect(() => {
    if (student) {
      console.log('Student data received:', {
        name: student.full_name,
        profileImage: student.profile_image_url,
        hasImage: !!student.profile_image_url,
        fullData: student
      });
    }
  }, [student]);

  if (isLoading) {
    return (
      <ProfileLayout>
        <div className="flex items-center justify-center p-16">
          <div className="flex flex-col items-center text-[#1c274d] text-xl font-semibold p-8 bg-white rounded-lg shadow-xl">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#407dc3] mb-3"></div>
            Cargando perfil del estudiante...
          </div>
        </div>
      </ProfileLayout>
    );
  }

  if (error || !student) {
    return (
      <ProfileLayout>
        <div className="flex items-center justify-center p-16">
          <div className="p-8 bg-white rounded-lg shadow-xl border-l-4 border-[#db1320] text-[#1c274d] max-w-md w-full">
            <h2 className="text-xl font-bold text-[#db1320] mb-2">Error</h2>
            <p className="text-gray-600 mb-4">{error || 'Perfil de estudiante no encontrado.'}</p>
            <button 
              onClick={() => window.history.back()}
              className="bg-[#407dc3] text-white py-2 px-4 rounded-lg hover:bg-[#346da6] transition-colors"
            >
              Volver Atrás
            </button>
          </div>
        </div>
      </ProfileLayout>
    );
  }
  
  return (
    <ProfileLayout>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Perfil del Estudiante</h1>
        <p className="text-gray-600">Vista de reclutador - Solo lectura</p>
      </div>
      
      <CompanyStudentProfile student={student} />
    </ProfileLayout>
  );
}
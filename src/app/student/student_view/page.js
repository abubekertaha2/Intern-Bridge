'use client';
import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { 
  MapPin, Mail, Phone, Briefcase, Star, Award, 
  CheckCircle2, Earth, UserCheck
} from 'lucide-react';
import ProfileLayout from '@/components/layout/ProfileLayout';

// --- Main Read-Only Company Profile Component ---
export default function CompanyProfileView() {
  const searchParams = useSearchParams();
  const companyId = searchParams.get('companyId');
  
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [companyInternships, setCompanyInternships] = useState([]);

  // Fetch company profile data when companyId is available
  useEffect(() => {
    if (companyId) {
      console.log('Company ID from URL:', companyId);
      fetchCompanyProfile();
    } else {
      console.log('No companyId found in URL');
      setError('No se proporcionó ID de empresa');
      setLoading(false);
    }
  }, [companyId]);

  const fetchCompanyInternships = async (companyId) => {
    try {
      console.log('Fetching internships for company:', companyId);
      const response = await fetch(`/api/company_internship?companyId=${companyId}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCompanyInternships(data.internships);
        }
      } else {
        console.error('Failed to fetch internships, status:', response.status);
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Starting to fetch company profile for ID:', companyId);
      
      const response = await fetch(`/api/company_profile?companyId=${companyId}`);
      console.log('API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('API Response data:', data);
        
        if (data.success) {
          setCompanyData(data.company);
          // Fetch internships for this company
          if (data.company.id) {
            await fetchCompanyInternships(data.company.id);
          }
        } else {
          setError(data.error || 'Error al cargar el perfil');
        }
      } else {
        setError(`Error HTTP: ${response.status}`);
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
      setError('Error de conexión al cargar el perfil');
    } finally {
      setLoading(false);
    }
  };

  // Show loading state
  if (loading) {
    return (
      <ProfileLayout userType="student">
        <div className="min-h-screen bg-[#f5f5f5] p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#407dc3] mx-auto"></div>
            <p className="mt-4 text-[#1c274d]">Cargando perfil de la empresa...</p>
            <p className="text-sm text-gray-500 mt-2">ID: {companyId}</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  // Show error state
  if (error) {
    return (
      <ProfileLayout userType="student">
        <div className="min-h-screen bg-[#f5f5f5] p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500 text-lg mb-4">Error: {error}</p>
            <p className="text-sm text-gray-500 mb-4">Company ID: {companyId || 'No disponible'}</p>
            <button 
              onClick={fetchCompanyProfile}
              className="bg-[#407dc3] text-white px-6 py-2 rounded hover:bg-[#1c274d]"
            >
              Reintentar
            </button>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  if (!companyData) {
    return (
      <ProfileLayout userType="student">
        <div className="min-h-screen bg-[#f5f5f5] p-8 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-500">No se pudo cargar el perfil de la empresa</p>
            <button 
              onClick={fetchCompanyProfile}
              className="mt-4 bg-[#407dc3] text-white px-4 py-2 rounded hover:bg-[#1c274d]"
            >
              Reintentar
            </button>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  return (
    <ProfileLayout userType="student">
      <div className="min-h-screen bg-white">
        
        <div className="w-full bg-[#407dc3] text-white p-8 shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center gap-6 mb-6">
              {/* Logo Profile */}
              <div className="relative">
                {companyData.logo ? (
                  <div className="w-30 h-30 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                    <img 
                      src={companyData.logo} 
                      alt={`${companyData.name} logo`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-20 h-20 bg-[#1c274d] rounded-full flex items-center justify-center text-2xl font-extrabold shadow-2xl border-4 border-white">
                    {companyData.name?.charAt(0) || 'C'}
                  </div>
                )}
              </div>
              
              <div className="flex-1">
                <h1 className="text-3xl font-bold mb-2">{companyData.name || 'Nombre de la Empresa'}</h1>
                <p className="text-lg opacity-90 font-light">{companyData.industry || 'Industria no especificada'}</p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-3 text-sm font-semibold">
              {companyData.verified && (
                <span className="bg-[#28a745] px-4 py-2 rounded-full flex items-center gap-2 shadow-md">
                  <UserCheck className="w-4 h-4" /> Empresa Verificada
                </span>
              )}
              {companyData.premium_partner && (
                <span className="bg-[#1c274d] px-4 py-2 rounded-full shadow-md flex items-center gap-2">
                  <Star className="w-4 h-4" /> Premium Partner
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-8">
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            
            <div className="flex-1 lg:flex-[3] space-y-6">
              <CompanyInfoSection companyData={companyData} />
              <CompanyDescriptionSection companyData={companyData} />
              <FeaturedOpportunitiesSection internships={companyInternships} />
              <BenefitsSection companyData={companyData} />
            </div>
            
            <div className="flex-1 lg:flex-[2] space-y-6">
              <StatisticsSection companyData={companyData} internships={companyInternships} />
              <LocationsSection companyData={companyData} />
              <ContactSection companyData={companyData} />
            </div>
          </div>
        </div>
      </div>
    </ProfileLayout>
  );
}

// 1. Company Info Section (Read-only)
function CompanyInfoSection({ companyData }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-0">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-[#1c274d] flex items-center gap-2">
              <span className="text-lg">ℹ️</span> Información de la Empresa
            </h3>
          </div>
          <div className="space-y-2 text-sm text-[#1c274d]">
            <div className="flex justify-between">
              <span className="font-semibold">Sector:</span>
              <span>{companyData.industry || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Tamaño:</span>
              <span>{companyData.size || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Fundado:</span>
              <span>{companyData.founded_year || 'No especificado'}</span>
            </div>
            <div className="flex justify-between">
              <span className="font-semibold">Sitio Web:</span>
              <span>{companyData.website || 'No especificado'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Company Description Section (Read-only)
function CompanyDescriptionSection({ companyData }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-0">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <h3 className="font-bold text-[#1c274d] mb-3 flex items-center gap-2">
            <span>📝</span> Descripción de la Empresa
          </h3>
          <p className="text-sm text-[#656565] leading-relaxed">
            {companyData.description || 'No hay descripción disponible.'}
          </p>
        </div>
      </div>
    </div>
  );
}

// 3. Featured Opportunities Section (Read-only)
function FeaturedOpportunitiesSection({ internships }) {
  const safeInternships = Array.isArray(internships) ? internships : [];

  return (
    <div className="bg-blue-100 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-6">
        <h3 className="font-bold text-[#1c274d] mb-4 flex items-center gap-2 text-lg">
          <Briefcase className="w-5 h-5" /> Oportunidades Destacadas
        </h3>
        <div className="space-y-4 bg-white p-4 rounded-lg">
          {safeInternships.length > 0 ? (
            safeInternships.map((internship) => (
              <div key={internship.id} className="border border-[#d9d9d9] rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer">
                <h4 className="font-semibold text-[#1c274d] mb-2">{internship.title || 'Sin título'}</h4>
                <div className="flex flex-wrap gap-4 text-sm text-[#656565] mb-3">
                  <span className="bg-[#407DC3] p-2 rounded text-white">
                    {internship.workArea || internship.work_area || 'Área no especificada'}
                  </span>
                  <span><Earth className="inline w-4 h-4" /></span>
                  <span>Pasantía</span>
                  <span><MapPin className="inline w-4 h-4" /></span>
                  <span>{internship.schedule || 'Horario no especificado'}</span>
                </div>

              </div>
            ))
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Briefcase className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay pasantías publicadas actualmente</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Benefits Section (Read-only)
function BenefitsSection({ companyData }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-4">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <h3 className="font-bold text-[#1c274d] mb-3 flex items-center gap-2">
            <span>⭐</span> Beneficios para Practicantes
          </h3>

          {/* Display Selected Benefits */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {companyData.benefits?.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center gap-2 bg-white p-2 rounded-lg border border-gray-200"
                >
                  <CheckCircle2 className="w-4 h-4 text-[#28a745] flex-shrink-0" />
                  <span className="text-[#656565] text-sm">{benefit}</span>
                </div>
              ))}
            </div>
            
            {(!companyData.benefits || companyData.benefits.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">
                No hay beneficios configurados.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 1. Statistics Section (Read-only)
function StatisticsSection({ companyData, internships }) {
  const activeInternships = Array.isArray(internships) ? internships.length : 0;
  
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-6">
        <h3 className="font-bold text-[#1c274d] mb-4 flex items-center gap-2 text-lg">
          <Award className="w-5 h-5" /> Estadísticas de la Empresa
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <StatBox title="Pasantías Activas" value={activeInternships} color="#407dc3" />
          <StatBox title="Tasa de Conversión" value={`${companyData.conversion_rate || '0'}%`} color="#407dc3" />
          <StatBox title="Valoración" value={`${companyData.rating || '0'}/5`} color="#407dc3" />
          <StatBox title="Ex-practicantes" value={companyData.former_student || 0} color="#407dc3" />
        </div>
      </div>
    </div>
  );
}

// 2. Locations Section (Read-only)
function LocationsSection({ companyData }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-4">
        <div className="bg-[#cfe5ff] p-2 rounded-lg transition-shadow hover:shadow-md">
          <h3 className="font-bold text-[#1c274d] mb-3 flex items-center gap-2">
            <MapPin className="w-4 h-4" /> Ubicaciones
          </h3>

          <div className="space-y-2 text-sm">
            {companyData.locations?.map((location, index) => (
              <div key={location.id || index}>
                <div className="font-semibold text-[#1c274d]">
                  {location.is_remote ? '🌐' : '🏢'} {location.name}
                  {location.is_primary && ' (Sede Principal)'}
                </div>
                <div className="text-[#656565] text-xs">
                  {location.address}
                </div>
              </div>
            ))}
            {(!companyData.locations || companyData.locations.length === 0) && (
              <p className="text-gray-500 text-sm">No hay ubicaciones configuradas.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// 3. Contact Section (Read-only)
function ContactSection({ companyData }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-4">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <h3 className="font-bold text-[#1c274d] mb-3 flex items-center gap-2">
            <span>📞</span> Información de Contacto
          </h3>
          <div className="space-y-2 text-sm text-[#656565]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1c274d]">Responsable RRHH:</span>
              <span>{companyData.hr_contact_name || 'No especificado'}</span>
            </div>
            <ContactDetail icon={Mail} text={companyData.email} />
            <ContactDetail icon={Phone} text={companyData.phone} />
          </div>
        </div>
      </div>
    </div>
  );
}

// --- REUSABLE COMPONENTS ---

const StatBox = ({ title, value, color }) => (
  <div className="bg-[#cfe5ff] p-3 rounded-lg text-center shadow-inner">
    <div className={`text-3xl font-extrabold`} style={{ color }}>{value}</div>
    <div className="text-xs text-[#656565] mt-1">{title}</div>
  </div>
);

const ContactDetail = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-[#1c274d] flex-shrink-0" />
    <span>{text || 'No especificado'}</span>
  </div>
);
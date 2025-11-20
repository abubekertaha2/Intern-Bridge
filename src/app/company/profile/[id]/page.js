'use client';
import React, { useState, useMemo, useEffect } from 'react';
import { 
  CheckCircle2, MapPin, Mail, Phone,
  ChevronLeft, ChevronRight, Calendar, UserCheck,
  Briefcase, Star, Award, Edit3, Save, X, Plus, Trash2, Earth
} from 'lucide-react';
import ProfileLayout from '@/components/layout/ProfileLayout';

// --- Main App Component ---
export default function CompanyProfilePage({ params }) {
  const [id, setId] = useState(null);
  const [showInternshipForm, setShowInternshipForm] = useState(false);
  const [companyData, setCompanyData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoPreview, setLogoPreview] = useState(null);
  const [companyInternships, setCompanyInternships] = useState([]); 
  
  const [editingInternship, setEditingInternship] = useState(null);
  const [showEditForm, setShowEditForm] = useState(false);
  const [deletingInternshipId, setDeletingInternshipId] = useState(null);

  // States for individual section editing
  const [editingSection, setEditingSection] = useState(null);

  useEffect(() => {
    const loadParams = async () => {
      const resolvedParams = await params;
      setId(resolvedParams.id);
    };
    loadParams();
  }, [params]);

  // Fetch company profile data when id is available
  useEffect(() => {
    if (id) {
      fetchCompanyProfile();
    }
  }, [id]);

  // Fetch company internships
  const fetchCompanyInternships = async (companyId) => {
    try {
      const response = await fetch(`/api/company_internship?companyId=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCompanyInternships(data.internships);
        }
      }
    } catch (error) {
      console.error('Error fetching internships:', error);
    }
  };

  const fetchCompanyProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/company_profile?companyId=${id}`);
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setCompanyData(data.company);
          // Set logo preview if logo exists
          if (data.company.logo) {
            setLogoPreview(data.company.logo);
          }
          // Fetch internships for this company
          if (data.company.id) {
            fetchCompanyInternships(data.company.id);
          }
        } else {
          console.error('Error fetching profile:', data.error);
        }
      } else {
        console.error('Failed to fetch profile');
      }
    } catch (error) {
      console.error('Error fetching company profile:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      const response = await fetch('/api/company_profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(companyData),
      });

      const result = await response.json();
      
      if (result.success) {
        setEditingSection(null);
        await fetchCompanyProfile();
        alert('Perfil actualizado exitosamente');
      } else {
        alert('Error al actualizar el perfil: ' + result.error);
      }
    } catch (error) {
      console.error('Error saving company profile:', error);
      alert('Error al guardar los cambios');
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setEditingSection(null);
    fetchCompanyProfile();
  };

  const updateField = (field, value) => {
    setCompanyData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type and size
      if (!file.type.startsWith('image/')) {
        alert('Por favor selecciona un archivo de imagen válido');
        return;
      }
      
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('La imagen debe ser menor a 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const logoUrl = e.target.result;
        setLogoPreview(logoUrl);
        // Update company data with logo
        setCompanyData(prev => ({
          ...prev,
          logo: logoUrl
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Refresh internships after creating a new one
  const refreshInternships = () => {
    if (companyData?.id) {
      fetchCompanyInternships(companyData.id);
    }
  };

  const startEditing = (section) => {
    setEditingSection(section);
  };

  if (loading) {
    return (
      <ProfileLayout userType="company" isOwnProfile={true}>
        <div className="min-h-screen bg-[#f5f5f5] p-8 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#407dc3] mx-auto"></div>
            <p className="mt-4 text-[#1c274d]">Cargando perfil de la empresa...</p>
          </div>
        </div>
      </ProfileLayout>
    );
  }

  if (!companyData) {
    return (
      <ProfileLayout userType="company" isOwnProfile={true}>
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
    <ProfileLayout userType="company" isOwnProfile={true}>
      <div className="min-h-screen bg-white">
        
        {/* Full Width Header - Takes full width */}
        <div className="w-full bg-[#407dc3] text-white p-8 shadow-2xl">
          <div className="max-w-7xl mx-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-6">
                {/* Logo Profile - Clickable for upload */}
                <label className="relative cursor-pointer">
                  {logoPreview ? (
                    <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-2xl">
                      <img 
                        src={logoPreview} 
                        alt={`${companyData.name} logo`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ) : (
                    <div className="w-32 h-32 bg-[#1c274d] rounded-full flex items-center justify-center text-2xl font-extrabold shadow-2xl border-4 border-white">
                      {companyData.name?.charAt(0) || 'C'}
                    </div>
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                
                <div>
                  {editingSection === 'header' ? (
                    <div className="space-y-3">
                      <input
                        type="text"
                        value={companyData.name || ''}
                        onChange={(e) => updateField('name', e.target.value)}
                        className="text-3xl font-bold bg-white/10 border border-white/30 rounded px-3 py-1 text-white"
                        placeholder="Nombre de la Empresa"
                      />
                      <input
                        type="text"
                        value={companyData.industry || ''}
                        onChange={(e) => updateField('industry', e.target.value)}
                        className="text-lg bg-white/10 border border-white/30 rounded px-3 py-1 text-white"
                        placeholder="Industria"
                      />
                    </div>
                  ) : (
                    <div>
                      <h1 className="text-3xl font-bold mb-2">{companyData.name || 'Nombre de la Empresa'}</h1>
                      <p className="text-lg opacity-90 font-light">{companyData.industry || 'Industria no especificada'}</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {editingSection === 'header' ? (
                  <>
                    <button 
                      onClick={handleSave}
                      disabled={saving}
                      className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                      title="Guardar cambios"
                    >
                      <Save className="w-5 h-5" />
                    </button>
                    <button 
                      onClick={handleCancel}
                      className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                      title="Cancelar"
                    >
                      <X className="w-5 h-5" />
                    </button>
                  </>
                ) : (
                  <button 
                    onClick={() => startEditing('header')}
                    className="text-white hover:text-gray-200 p-2 rounded-full hover:bg-white/10 transition-all duration-200"
                    title="Editar información principal"
                  >
                    <Edit3 className="w-5 h-5" />
                  </button>
                )}
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
          {/* Main Content - Two Panels */}
          <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
            
            {/* Left Panel - 3 parts ratio */}
            <div className="flex-1 lg:flex-[3] space-y-6">
              <CompanyInfoSection 
                companyData={companyData}
                isEditing={editingSection === 'companyInfo'}
                onUpdate={updateField}
                onEdit={() => startEditing('companyInfo')}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
              />
              <CompanyDescriptionSection 
                companyData={companyData}
                isEditing={editingSection === 'companyDescription'}
                onUpdate={updateField}
                onEdit={() => startEditing('companyDescription')}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
              />
              
              <FeaturedOpportunitiesSection 
                internships={companyInternships}
                companyData={companyData}
                onEdit={(internship) => {
                  setEditingInternship(internship);
                  setShowEditForm(true);
                }}
                onRefresh={refreshInternships}
              />
              <InternshipsButtonSection onButtonClick={() => setShowInternshipForm(!showInternshipForm)} />
              <BenefitsSection 
                companyData={companyData}
                isEditing={editingSection === 'benefits'}
                onUpdate={setCompanyData}
                onEdit={() => startEditing('benefits')}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
              />
            </div>
            
            {/* Right Panel - 2 parts ratio */}
            <div className="flex-1 lg:flex-[2] space-y-6">
              <StatisticsSection companyData={companyData} internships={companyInternships} />
              <LocationsSection 
                companyData={companyData}
                isEditing={editingSection === 'locations'}
                onUpdate={setCompanyData}
                onEdit={() => startEditing('locations')}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
              />
              <ContactSection 
                companyData={companyData}
                isEditing={editingSection === 'contact'}
                onUpdate={updateField}
                onEdit={() => startEditing('contact')}
                onSave={handleSave}
                onCancel={handleCancel}
                saving={saving}
              />
            </div>
          </div>

          {showInternshipForm && (
            <div className="max-w-7xl mx-auto mt-8">
              <InternshipForm 
                onClose={() => {
                  setShowInternshipForm(false);
                  refreshInternships(); 
                }} 
                companyData={companyData}
              />
            </div>
          )}

          {/* ADDED: Edit Internship Form - Shows when editing an internship */}
          {showEditForm && editingInternship && (
            <div className="max-w-7xl mx-auto mt-8">
              <EditInternshipForm 
                internship={editingInternship}
                companyData={companyData}
                onClose={() => {
                  setShowEditForm(false);
                  setEditingInternship(null);
                  refreshInternships(); // Refresh after closing form
                }} 
              />
            </div>
          )}
        </div>
      </div>
    </ProfileLayout>
  );
}

// --- LEFT PANEL COMPONENTS ---

// 1. Company Info Section - FIXED GRID FORMAT
function CompanyInfoSection({ companyData, isEditing, onUpdate, onEdit, onSave, onCancel, saving }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-0">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between mb-4">
            <h3 className="font-bold text-[#1c274d] flex items-center gap-2">
              <span className="text-lg">ℹ️</span> Información de la Empresa
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button 
                  onClick={onEdit}
                  className="text-[#1c274d] hover:text-[#407dc3] transition-colors p-1"
                  title="Editar información"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={onSave}
                    disabled={saving}
                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                    title="Guardar cambios"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onCancel}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          
          <div className="grid grid-cols-2 gap-6">
            
            <div className="space-y-4">
            
              <div>
                <div className="font-semibold text-[#1c274d] mb-2">Sector</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.industry || ''}
                    onChange={(e) => onUpdate('industry', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Ingresa el sector"
                  />
                ) : (
                  <div className="text-[#656565]">{companyData.industry || 'No especificado'}</div>
                )}
              </div>
              
              {/* Tamaño */}
              <div>
                <div className="font-semibold text-[#1c274d] mb-2">Tamaño</div>
                {isEditing ? (
                  <input
                    type="text"
                    value={companyData.size || ''}
                    onChange={(e) => onUpdate('size', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Ej: 1-10, 11-50, etc."
                  />
                ) : (
                  <div className="text-[#656565]">{companyData.size || 'No especificado'}</div>
                )}
              </div>
            </div>
            
            {/* Column 2 */}
            <div className="space-y-4">
            
              <div>
                <div className="font-semibold text-[#1c274d] mb-2">Fundado</div>
                {isEditing ? (
                  <input
                    type="number"
                    value={companyData.founded_year || ''}
                    onChange={(e) => onUpdate('founded_year', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="Año de fundación"
                  />
                ) : (
                  <div className="text-[#656565]">{companyData.founded_year || 'No especificado'}</div>
                )}
              </div>
              
             
              <div>
                <div className="font-semibold text-[#1c274d] mb-2">Sitio Web</div>
                {isEditing ? (
                  <input
                    type="url"
                    value={companyData.website || ''}
                    onChange={(e) => onUpdate('website', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded text-sm"
                    placeholder="https://ejemplo.com"
                  />
                ) : (
                  <div className="text-[#656565]">
                    {companyData.website ? (
                      <a href={companyData.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {companyData.website}
                      </a>
                    ) : (
                      'No especificado'
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// 2. Company Description Section 
function CompanyDescriptionSection({ companyData, isEditing, onUpdate, onEdit, onSave, onCancel, saving }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-0">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-[#1c274d] flex items-center gap-2">
              <span>📝</span> Descripción de la Empresa
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button 
                  onClick={onEdit}
                  className="text-[#1c274d] hover:text-[#407dc3] transition-colors p-1"
                  title="Editar descripción"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={onSave}
                    disabled={saving}
                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                    title="Guardar cambios"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onCancel}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          {isEditing ? (
            <textarea
              value={companyData.description || ''}
              onChange={(e) => onUpdate('description', e.target.value)}
              className="w-full h-32 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] text-sm text-[#656565] leading-relaxed"
              placeholder="Describe tu empresa..."
            />
          ) : (
            <p className="text-sm text-[#656565] leading-relaxed">
              {companyData.description || 'No hay descripción disponible.'}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

// 3. Featured Opportunities Section WITH EDIT/DELETE FUNCTIONALITY
function FeaturedOpportunitiesSection({ internships, companyData, onEdit, onRefresh }) {
  const safeInternships = Array.isArray(internships) ? internships : [];
  const [loadingId, setLoadingId] = useState(null);

  const handleDelete = async (internshipId) => {
    if (!confirm('¿Estás seguro de que quieres eliminar esta pasantía?')) {
      return;
    }

    setLoadingId(internshipId);
    try {
      const response = await fetch(`/api/internships/${internshipId}?companyId=${companyData.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        alert('Pasantía eliminada exitosamente');
        onRefresh(); // Refresh the list
      } else {
        alert('Error al eliminar la pasantía: ' + result.error);
      }
    } catch (error) {
      console.error('Error deleting internship:', error);
      alert('Error de conexión al eliminar la pasantía');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="bg-blue-100 rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-6">
        <h3 className="font-bold text-[#1c274d] mb-4 flex items-center gap-2 text-lg">
          <Briefcase className="w-5 h-5" /> Oportunidades Destacadas
        </h3>
        <div className="space-y-4 bg-white p-4 rounded-lg">
          {safeInternships.length > 0 ? (
            safeInternships.map((internship) => (
              <div key={internship.id} className="border border-[#d9d9d9] rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-semibold text-[#1c274d]">{internship.title || 'Sin título'}</h4>
                  <div className="flex gap-2">
                    {/* Edit Button */}
                    <button 
                      onClick={() => onEdit(internship)}
                      className="text-blue-600 hover:text-blue-800 transition-colors"
                      title="Editar pasantía"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    
                    {/* Delete Button */}
                    <button 
                      onClick={() => handleDelete(internship.id)}
                      disabled={loadingId === internship.id}
                      className="text-red-600 hover:text-red-800 transition-colors disabled:opacity-50"
                      title="Eliminar pasantía"
                    >
                      {loadingId === internship.id ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-red-600"></div>
                      ) : (
                        <Trash2 className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
                <div className="flex flex-wrap gap-4 text-sm text-[#656565] mb-3">
                  <span className="bg-[#407DC3] p-2 rounded text-white">
                    {internship.workArea || 'Área no especificada'}
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
              <p>No hay pasantías publicadas aún</p>
              <p className="text-sm">Crea tu primera pasantía para aparecer aquí</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Internships Button Section
function InternshipsButtonSection({ onButtonClick }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-6 text-center">
        <button 
          onClick={onButtonClick}
          className="w-full bg-[#1c274d] text-white font-bold py-4 rounded-lg hover:bg-[#407dc3] transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-3"
        >
          <Briefcase className="w-6 h-6" />
          Gestionar Pasantías
        </button>
        <p className="text-sm text-[#656565] mt-3">
          Publica nuevas pasantías y gestiona las existentes
        </p>
      </div>
    </div>
  );
}

// 5. Benefits Section WITH INDIVIDUAL EDITING
function BenefitsSection({ companyData, isEditing, onUpdate, onEdit, onSave, onCancel, saving }) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [newBenefit, setNewBenefit] = useState('');

  // Predefined benefits to choose from
  const predefinedBenefits = [
    "Almuerzo",
    "Transporte", 
    "Seguro Médico",
    "Flex Time",
    "Alojamiento",
    "Bonificaciones",
    "Capacitación",
    "Teletrabajo",
    "Estacionamiento gratuito",
    "Gimnasio",
    "Comedor",
    "Vestimenta laboral"
  ];

  // Handle clicking outside to close dropdown 
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.benefits-container')) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showDropdown]);

  const handleBenefitToggle = (benefit) => {
    const alreadySelected = companyData.benefits?.includes(benefit);
    const updatedBenefits = alreadySelected
      ? companyData.benefits?.filter((b) => b !== benefit) || []
      : [...(companyData.benefits || []), benefit];
    
    onUpdate({
      ...companyData,
      benefits: updatedBenefits
    });
    
    setShowDropdown(false);
  };

  const addCustomBenefit = () => {
    if (newBenefit.trim() && !companyData.benefits?.includes(newBenefit.trim())) {
      const updatedBenefits = [...(companyData.benefits || []), newBenefit.trim()];
      onUpdate({
        ...companyData,
        benefits: updatedBenefits
      });
      setNewBenefit('');
    }
  };

  const removeBenefit = (benefitToRemove) => {
    onUpdate({
      ...companyData,
      benefits: companyData.benefits?.filter(b => b !== benefitToRemove) || []
    });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl benefits-container">
      <div className="p-4">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-[#1c274d] flex items-center gap-2">
              <span>⭐</span> Beneficios para Practicantes
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button 
                  onClick={onEdit}
                  className="text-[#1c274d] hover:text-[#407dc3] transition-colors p-1"
                  title="Editar beneficios"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={onSave}
                    disabled={saving}
                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                    title="Guardar cambios"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onCancel}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="space-y-3 mb-4">
              {/* Custom Benefit Input */}
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newBenefit}
                  onChange={(e) => setNewBenefit(e.target.value)}
                  placeholder="Agregar beneficio personalizado..."
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
                  onKeyPress={(e) => e.key === 'Enter' && addCustomBenefit()}
                />
                <button 
                  onClick={addCustomBenefit}
                  className="bg-green-500 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-600 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" /> Agregar
                </button>
              </div>

              {/* Benefits Dropdown Trigger */}
              <div className="relative">
                <div
                  onClick={() => setShowDropdown(!showDropdown)}
                  className="w-full px-4 py-3 border-2 border-dashed border-[#407dc3] rounded-lg cursor-pointer hover:bg-blue-50 transition-colors text-center"
                >
                  <span className="text-[#407dc3] font-semibold flex items-center justify-center gap-2">
                    <Plus className="w-4 h-4" />
                    {showDropdown ? 'Cerrar lista' : 'Seleccionar beneficios de la lista'}
                  </span>
                </div>

                {/* Dropdown Menu */}
                {showDropdown && (
                  <div className="absolute z-50 mt-2 w-full bg-white border border-gray-300 rounded-lg shadow-xl max-h-60 overflow-y-auto">
                    <div className="p-2">
                      <h4 className="text-sm font-semibold text-[#1c274d] mb-2 px-2">
                        Beneficios disponibles:
                      </h4>
                      <div className="space-y-1">
                        {predefinedBenefits.map((benefit) => {
                          const isSelected = companyData.benefits?.includes(benefit);
                          return (
                            <div
                              key={benefit}
                              onClick={() => handleBenefitToggle(benefit)}
                              className={`px-3 py-2 cursor-pointer rounded-md text-sm transition-colors ${
                                isSelected
                                  ? "bg-[#1c274d] text-white"
                                  : "hover:bg-gray-100 text-gray-700"
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span>{benefit}</span>
                                {isSelected && (
                                  <CheckCircle2 className="w-4 h-4" />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Display Selected Benefits */}
          <div className="space-y-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              {companyData.benefits?.map((benefit, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between gap-2 bg-white p-2 rounded-lg border border-gray-200"
                >
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#28a745] flex-shrink-0" />
                    <span className="text-[#656565] text-sm">{benefit}</span>
                  </div>
                  {isEditing && (
                    <button 
                      onClick={() => removeBenefit(benefit)}
                      className="text-red-500 hover:text-red-700 p-1 transition-colors"
                      title="Eliminar beneficio"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
                </div>
              ))}
            </div>
            
            {(!companyData.benefits || companyData.benefits.length === 0) && (
              <p className="text-gray-500 text-sm text-center py-4">
                No hay beneficios configurados. {isEditing && "Haz clic arriba para agregar beneficios."}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// --- RIGHT PANEL COMPONENTS ---
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

// 2. Locations Section 
function LocationsSection({ companyData, isEditing, onUpdate, onEdit, onSave, onCancel, saving }) {
  const [newLocation, setNewLocation] = useState({ name: '', address: '', is_remote: false, is_primary: false });

  const addLocation = () => {
    if (newLocation.name.trim() && newLocation.address.trim()) {
      const updatedLocations = [...(companyData.locations || []), { 
        ...newLocation, 
        id: Date.now() 
      }];
      onUpdate({
        ...companyData,
        locations: updatedLocations
      });
      setNewLocation({ name: '', address: '', is_remote: false, is_primary: false });
    }
  };

  const removeLocation = (locationId) => {
    onUpdate({
      ...companyData,
      locations: companyData.locations?.filter(loc => loc.id !== locationId) || []
    });
  };

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-4">
        <div className="bg-[#cfe5ff] p-2 rounded-lg transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-[#1c274d] flex items-center gap-2">
              <MapPin className="w-4 h-4" /> Ubicaciones
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button 
                  onClick={onEdit}
                  className="text-[#1c274d] hover:text-[#407dc3] transition-colors p-1"
                  title="Editar ubicaciones"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={onSave}
                    disabled={saving}
                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                    title="Guardar cambios"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onCancel}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          
          {isEditing && (
            <div className="mb-4 p-3 bg-white text-black rounded border border-dashed border-gray-300">
              <h4 className="font-semibold text-sm mb-2">Agregar Nueva Ubicación</h4>
              <div className="space-y-2">
                <input
                  type="text"
                  value={newLocation.name}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Nombre de la ubicación"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <input
                  type="text"
                  value={newLocation.address}
                  onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                  placeholder="Dirección"
                  className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                />
                <div className="flex gap-4">
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={newLocation.is_remote}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, is_remote: e.target.checked }))}
                    />
                    Remoto
                  </label>
                  <label className="flex items-center gap-1 text-sm">
                    <input
                      type="checkbox"
                      checked={newLocation.is_primary}
                      onChange={(e) => setNewLocation(prev => ({ ...prev, is_primary: e.target.checked }))}
                    />
                    Principal
                  </label>
                </div>
                <button 
                  onClick={addLocation}
                  className="bg-green-500 text-white px-3 py-1 rounded text-sm hover:bg-green-600 flex items-center gap-1"
                >
                  <Plus className="w-3 h-3" /> Agregar
                </button>
              </div>
            </div>
          )}

          <div className="space-y-2 text-sm">
            {companyData.locations?.map((location) => (
              <div key={location.id}>
                <div className="font-semibold text-[#1c274d]">
                  {location.is_remote ? '🌐' : '🏢'} {location.name}
                  {location.is_primary && ' (Sede Principal)'}
                </div>
                <div className="text-[#656565] text-xs flex justify-between items-center">
                  {location.address}
                  {isEditing && (
                    <button 
                      onClick={() => removeLocation(location.id)}
                      className="text-red-500 hover:text-red-700 p-1"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  )}
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

// 3. Contact Section WITH INDIVIDUAL EDITING
function ContactSection({ companyData, isEditing, onUpdate, onEdit, onSave, onCancel, saving }) {
  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-2xl transition-all duration-300 transform hover:shadow-3xl">
      <div className="p-4">
        <div className="bg-[#cfe5ff] p-4 rounded-lg transition-shadow hover:shadow-md">
          <div className="flex items-start justify-between mb-3">
            <h3 className="font-bold text-[#1c274d] flex items-center gap-2">
              <span>📞</span> Información de Contacto
            </h3>
            <div className="flex items-center gap-2">
              {!isEditing ? (
                <button 
                  onClick={onEdit}
                  className="text-[#1c274d] hover:text-[#407dc3] transition-colors p-1"
                  title="Editar información de contacto"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={onSave}
                    disabled={saving}
                    className="text-green-600 hover:text-green-800 transition-colors p-1"
                    title="Guardar cambios"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button 
                    onClick={onCancel}
                    className="text-red-600 hover:text-red-800 transition-colors p-1"
                    title="Cancelar"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2 text-sm text-[#656565]">
            <div className="flex items-center gap-2">
              <span className="font-semibold text-[#1c274d]">Responsable RRHH:</span>
              {isEditing ? (
                <input
                  type="text"
                  value={companyData.hr_contact_name || ''}
                  onChange={(e) => onUpdate('hr_contact_name', e.target.value)}
                  className="px-2 py-1 border border-gray-300 rounded text-sm"
                />
              ) : (
                <span>{companyData.hr_contact_name || 'No especificado'}</span>
              )}
            </div>
            <ContactDetail 
              icon={Mail} 
              text={companyData.email} 
              isEditing={isEditing}
              onEdit={(value) => onUpdate('email', value)}
            />
            <ContactDetail 
              icon={Phone} 
              text={companyData.phone} 
              isEditing={isEditing}
              onEdit={(value) => onUpdate('phone', value)}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function EditInternshipForm({ internship, companyData, onClose }) {
  const [formData, setFormData] = useState({
    title: internship.title || "",
    description: internship.description || "",
    startDate: internship.startDate || internship.start_date || "",
    endDate: internship.endDate || internship.end_date || "",
    workArea: internship.workArea || internship.work_area || "",
    schedule: internship.schedule || "",
    salary: internship.salary || "",
    duration: internship.duration || "",
    benefits: internship.benefits || [],
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predefinedBenefits = [
    "Almuerzo",
    "Transporte",
    "Seguro Médico",
    "Flex Time",
    "Alojamiento",
    "Bonificaciones",
    "Capacitación",
    "Teletrabajo",
    "Estacionamiento gratuito",
  ];

  const handleBenefitToggle = (benefit) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title || !formData.startDate || !formData.endDate || !formData.workArea || !formData.schedule) {
        setError("Por favor completa todos los campos obligatorios");
        setLoading(false);
        return;
      }

      const submissionData = {
        ...formData,
        companyId: companyData.id
      };

      const response = await fetch(`/api/internships/${internship.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Pasantía actualizada exitosamente!');
        onClose();
      } else {
        setError(result.error || 'Error al actualizar la pasantía');
      }
    } catch (error) {
      console.error('Error updating internship:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  const formatDateTitle = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const CalendarWidget = useMemo(() => {
    const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-center text-xs text-[#d9d9d9]">
          -
        </div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div key={i} className="text-center text-xs p-1 hover:bg-[#407dc3] hover:text-white rounded-full cursor-pointer transition-colors duration-150">
          {i}
        </div>
      );
    }

    return (
      <div className="bg-white border border-[#d9d9d9] rounded-lg p-4 w-64 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-[#1c274d]">{formatDateTitle(currentMonth)}</h4>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-[#f5f5f5] rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#1c274d]" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-[#f5f5f5] rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#1c274d]" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-center mb-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-[#656565]">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  }, [currentMonth]);

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 relative">
      
      {/* Dynamic Calendar Popover */}
      {showCalendar && (
        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {CalendarWidget}
        </div>
      )}

      {/* Form Title */}
      <h1 className="text-4xl font-extrabold text-[#1c274d] mb-8 text-center leading-snug">
        Editar Pasantía
      </h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
         
          <div className="border-b pb-6 border-gray-200">
            <h2 className="text-xl font-bold text-[#1c274d] mb-4">Datos Obligatorios*</h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">
                  Título de la Pasantía*
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Desarrollador Full Stack Intern"
                  className="w-full text-black px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">
                  Descripción*
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe las responsabilidades y requisitos de la pasantía..."
                  className="w-full text-black h-32 px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Start Date */}
                <DateInput
                  label="Fecha de inicio de la postulación*"
                  value={formData.startDate}
                  onChange={(value) => setFormData({ ...formData, startDate: value })}
                />

                {/* End Date */}
                <DateInput
                  label="Fecha de cierre de la postulación*"
                  value={formData.endDate}
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                />

                {/* Work Area */}
                <SelectInput
                  label="Áreas de trabajo*"
                  value={formData.workArea}
                  onChange={(value) => setFormData({ ...formData, workArea: value })}
                  options={[
                    { value: "", label: "Seleccionar" },
                    { value: "frontend", label: "Frontend" },
                    { value: "backend", label: "Backend" },
                    { value: "fullstack", label: "Full Stack" },
                    { value: "data", label: "Data Science" },
                    {value: "AI", label: "Inteligencia Artificial"},
                    { value: "marketing", label: "Marketing"},
                    { value: "design", label: "Diseño" },
                    { value: "hr", label: "Recursos Humanos" },
                    { value: "sales", label: "Ventas" },
                  ]}
                />

                {/* Schedule */}
                <SelectInput
                  label="Horario / turno*"
                  value={formData.schedule}
                  onChange={(value) => setFormData({ ...formData, schedule: value })}
                  options={[
                    { value: "", label: "Seleccionar" },
                    { value: "morning", label: "Mañana" },
                    { value: "afternoon", label: "Tarde" },
                    { value: "flexible", label: "Flexible" },
                    { value: "fulltime", label: "Tiempo Completo" },
                    { value: "parttime", label: "Medio Tiempo" },
                    { value: "weekends", label: "Fines de Semana"},
                    { value: "remote", label: "Remoto" },
                    { value: "onsite", label: "Presencial" },
                    { value: "hybrid", label: "Híbrido" },
                  ]}
                />
              </div>
            </div>
          </div>

         
          <div>
            <h2 className="text-xl font-bold text-[#1c274d] mb-4">Datos Opcionales</h2>

            <div className="space-y-6">
              
              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">Salario</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="Ej. 1000$ Mensual"
                  className="w-full text-black px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-3">Beneficios</label>
                <div className="relative">
                  {/* Input area showing selected benefits */}
                  <div
                    className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer min-h-[44px]"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {formData.benefits.length > 0 ? (
                      formData.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center bg-[#1c274d] text-white px-3 py-1 rounded-full text-sm"
                        >
                          {benefit}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBenefitToggle(benefit);
                            }}
                            className="ml-2 text-white hover:text-gray-200"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Seleccionar beneficios...</span>
                    )}
                  </div>

                  {/* Dropdown list */}
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {predefinedBenefits.map((benefit) => {
                        const isSelected = formData.benefits.includes(benefit);
                        return (
                          <div
                            key={benefit}
                            onClick={() => handleBenefitToggle(benefit)}
                            className={`px-4 py-2 cursor-pointer text-sm ${
                              isSelected
                                ? "bg-[#1c274d] text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {benefit}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">Duración de la Pasantía</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="6 meses"
                  className="w-full px-4 text-black py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#407dc3] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Actualizando Pasantía...' : 'Actualizar Pasantía'}
            </button>
          </div>
          
          {/* VOLVER BUTTON */}
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full text-[#db1320] font-bold py-2 hover:text-[#a00d17] transition-colors mt-2 disabled:opacity-50"
          >
            Volver
          </button>

          <button 
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full text-gray-500 font-bold py-2 hover:text-gray-700 transition-colors text-sm" 
          >
            {showCalendar ? 'Ocultar Calendario' : 'Mostrar Calendario de Fechas'}
          </button>
        </div>
      </form>
    </div>
  );
}

// INTERNSHIP FORM COMPONENT 
function InternshipForm({ onClose, companyData }) {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDate: "",
    endDate: "",
    workArea: "",
    schedule: "",
    salary: "",
    duration: "",
    benefits: [],
  });

  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [showCalendar, setShowCalendar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const predefinedBenefits = [
    "Almuerzo",
    "Transporte",
    "Seguro Médico",
    "Flex Time",
    "Alojamiento",
    "Bonificaciones",
    "Capacitación",
    "Teletrabajo",
    "Estacionamiento gratuito",
  ];

  // Get company data from localStorage
  const getCompanyData = () => {
    if (typeof window !== 'undefined') {
      const userData = localStorage.getItem('user');
      const companyData = localStorage.getItem('company');
      return {
        user: userData ? JSON.parse(userData) : null,
        company: companyData ? JSON.parse(companyData) : null
      };
    }
    return { user: null, company: null };
  };

  const handleBenefitToggle = (benefit) => {
    setFormData((prev) => ({
      ...prev,
      benefits: prev.benefits.includes(benefit)
        ? prev.benefits.filter((b) => b !== benefit)
        : [...prev.benefits, benefit],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Validate required fields
      if (!formData.title || !formData.startDate || !formData.endDate || !formData.workArea || !formData.schedule) {
        setError("Por favor completa todos los campos obligatorios");
        setLoading(false);
        return;
      }

      // Get company data from localStorage or props
      let companyId
      if (companyData && companyData.id) {
        companyId = companyData.id;
      } else {
        const { company } = getCompanyData();
        companyId = company?.id;
      }

      if (!companyId) {
        setError("No se pudo obtener la información de la empresa. Por favor, inicia sesión nuevamente.");
        setLoading(false);
        return;
      }

      // Add companyId to the form data
      const submissionData = {
        ...formData,
        companyId: companyId
      };

      const response = await fetch('/api/internships', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });

      const result = await response.json();

      if (result.success) {
        alert('Pasantía creada exitosamente!');
        onClose();
      } else {
        setError(result.error || 'Error al crear la pasantía');
      }
    } catch (error) {
      console.error('Error creating internship:', error);
      setError('Error de conexión. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };
  
  const formatDateTitle = (date) => {
    return date.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' });
  };

  const CalendarWidget = useMemo(() => {
    const getDaysInMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (date) => {
      return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth);
    const firstDay = getFirstDayOfMonth(currentMonth);
    const days = [];

    for (let i = 0; i < firstDay; i++) {
      days.push(
        <div key={`empty-${i}`} className="text-center text-xs text-[#d9d9d9]">
          -
        </div>
      );
    }

    for (let i = 1; i <= daysInMonth; i++) {
      days.push(
        <div key={i} className="text-center text-xs p-1 hover:bg-[#407dc3] hover:text-white rounded-full cursor-pointer transition-colors duration-150">
          {i}
        </div>
      );
    }

    return (
      <div className="bg-white border border-[#d9d9d9] rounded-lg p-4 w-64 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <h4 className="text-sm font-bold text-[#1c274d]">{formatDateTitle(currentMonth)}</h4>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1))}
              className="p-1 hover:bg-[#f5f5f5] rounded-full transition-colors"
            >
              <ChevronLeft className="w-4 h-4 text-[#1c274d]" />
            </button>
            <button
              onClick={() => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1))}
              className="p-1 hover:bg-[#f5f5f5] rounded-full transition-colors"
            >
              <ChevronRight className="w-4 h-4 text-[#1c274d]" />
            </button>
          </div>
        </div>
        <div className="grid grid-cols-7 gap-1 text-xs font-semibold text-center mb-2">
          {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day) => (
            <div key={day} className="text-[#656565]">
              {day}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-7 gap-1">{days}</div>
      </div>
    );
  }, [currentMonth]);

  return (
    <div className="w-full max-w-2xl bg-white rounded-xl shadow-2xl p-8 relative">
      
      {/* Dynamic Calendar Popover */}
      {showCalendar && (
        <div className="absolute z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
            {CalendarWidget}
        </div>
      )}

      {/* Form Title */}
      <h1 className="text-4xl font-extrabold text-[#1c274d] mb-8 text-center leading-snug">
        Agregar Nueva
        <br />
        Pasantía
      </h1>

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Form Content */}
      <form onSubmit={handleSubmit}>
        <div className="space-y-8">
          
          
          <div className="border-b pb-6 border-gray-200">
            <h2 className="text-xl font-bold text-[#1c274d] mb-4">Datos Obligatorios*</h2>

            <div className="space-y-6">
              {/* Title */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">
                  Título de la Pasantía*
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Desarrollador Full Stack Intern"
                  className="w-full text-black px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">
                  Descripción*
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Describe las responsabilidades y requisitos de la pasantía..."
                  className="w-full text-black h-32 px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Start Date */}
                <DateInput
                  label="Fecha de inicio de la postulación*"
                  value={formData.startDate}
                  onChange={(value) => setFormData({ ...formData, startDate: value })}
                />

                {/* End Date */}
                <DateInput
                  label="Fecha de cierre de la postulación*"
                  value={formData.endDate}
                  onChange={(value) => setFormData({ ...formData, endDate: value })}
                />

                {/* Work Area */}
                <SelectInput
                  label="Áreas de trabajo*"
                  value={formData.workArea}
                  onChange={(value) => setFormData({ ...formData, workArea: value })}
                  options={[
                    { value: "", label: "Seleccionar" },
                    { value: "frontend", label: "Frontend" },
                    { value: "backend", label: "Backend" },
                    { value: "fullstack", label: "Full Stack" },
                    { value: "data", label: "Data Science" },
                    {value: "AI", label: "Inteligencia Artificial"},
                    { value: "marketing", label: "Marketing"},
                    { value: "design", label: "Diseño" },
                    { value: "hr", label: "Recursos Humanos" },
                    { value: "sales", label: "Ventas" },
                  ]}
                />

                {/* Schedule */}
                <SelectInput
                  label="Horario / turno*"
                  value={formData.schedule}
                  onChange={(value) => setFormData({ ...formData, schedule: value })}
                  options={[
                    { value: "", label: "Seleccionar" },
                    { value: "morning", label: "Mañana" },
                    { value: "afternoon", label: "Tarde" },
                    { value: "flexible", label: "Flexible" },
                    { value: "fulltime", label: "Tiempo Completo" },
                    { value: "parttime", label: "Medio Tiempo" },
                    { value: "weekends", label: "Fines de Semana"},
                    { value: "remote", label: "Remoto" },
                    { value: "onsite", label: "Presencial" },
                    { value: "hybrid", label: "Híbrido" },
                  ]}
                />
              </div>
            </div>
          </div>

         
          <div>
            <h2 className="text-xl font-bold text-[#1c274d] mb-4">Datos Opcionales</h2>

            <div className="space-y-6">
              
              {/* Salary */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">Salario</label>
                <input
                  type="text"
                  value={formData.salary}
                  onChange={(e) => setFormData({ ...formData, salary: e.target.value })}
                  placeholder="Ej. 1000$ Mensual"
                  className="w-full text-black px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                />
              </div>

              {/* Benefits */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-3">Beneficios</label>
                <div className="relative">
                  {/* Input area showing selected benefits */}
                  <div
                    className="flex flex-wrap items-center gap-2 border border-gray-300 rounded-lg p-2 cursor-pointer min-h-[44px]"
                    onClick={() => setShowDropdown(!showDropdown)}
                  >
                    {formData.benefits.length > 0 ? (
                      formData.benefits.map((benefit) => (
                        <div
                          key={benefit}
                          className="flex items-center bg-[#1c274d] text-white px-3 py-1 rounded-full text-sm"
                        >
                          {benefit}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleBenefitToggle(benefit);
                            }}
                            className="ml-2 text-white hover:text-gray-200"
                          >
                            ✕
                          </button>
                        </div>
                      ))
                    ) : (
                      <span className="text-gray-400 text-sm">Seleccionar beneficios...</span>
                    )}
                  </div>

                  {/* Dropdown list */}
                  {showDropdown && (
                    <div className="absolute z-10 mt-1 w-full bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {predefinedBenefits.map((benefit) => {
                        const isSelected = formData.benefits.includes(benefit);
                        return (
                          <div
                            key={benefit}
                            onClick={() => handleBenefitToggle(benefit)}
                            className={`px-4 py-2 cursor-pointer text-sm ${
                              isSelected
                                ? "bg-[#1c274d] text-white"
                                : "hover:bg-gray-100 text-gray-700"
                            }`}
                          >
                            {benefit}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

              {/* Duration */}
              <div>
                <label className="block text-sm font-semibold text-[#1c274d] mb-2">Duración de la Pasantía</label>
                <input
                  type="text"
                  value={formData.duration}
                  onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                  placeholder="6 meses"
                  className="w-full px-4 text-black py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] transition-shadow"
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6">
            <button 
              type="submit"
              disabled={loading}
              className="flex-1 bg-[#407dc3] text-white font-bold py-3 rounded-lg hover:bg-opacity-90 transition-colors shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creando Pasantía...' : 'Crear Pasantía'}
            </button>
          </div>
          
          {/* VOLVER BUTTON  */}
          <button 
            type="button"
            onClick={onClose}
            disabled={loading}
            className="w-full text-[#db1320] font-bold py-2 hover:text-[#a00d17] transition-colors mt-2 disabled:opacity-50"
          >
            Volver
          </button>

          <button 
            type="button"
            onClick={() => setShowCalendar(!showCalendar)}
            className="w-full text-gray-500 font-bold py-2 hover:text-gray-700 transition-colors text-sm" 
          >
            {showCalendar ? 'Ocultar Calendario' : 'Mostrar Calendario de Fechas'}
          </button>
        </div>
      </form>
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

const ContactDetail = ({ icon: Icon, text, isEditing, onEdit }) => (
  <div className="flex items-center gap-2">
    <Icon className="w-4 h-4 text-[#1c274d] flex-shrink-0" />
    {isEditing ? (
      <input
        type="text"
        value={text || ''}
        onChange={(e) => onEdit(e.target.value)}
        className="px-2 py-1 border border-gray-300 rounded text-sm flex-1"
      />
    ) : (
      <span>{text || 'No especificado'}</span>
    )}
  </div>
);

const DateInput = ({ label, value, onChange }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1c274d] mb-2">{label}</label>
    <div className="relative">
      <input
        type="date"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] bg-white text-[#656565] transition-shadow"
        required
      />
      <Calendar className="absolute right-3 top-2.5 w-5 h-5 text-[#d9d9d9] pointer-events-none" />
    </div>
  </div>
);

const SelectInput = ({ label, value, onChange, options }) => (
  <div>
    <label className="block text-sm font-semibold text-[#1c274d] mb-2">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full px-4 py-2 border border-[#d9d9d9] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#407dc3] bg-white text-[#656565] transition-shadow"
      required
    >
      {options.map(opt => (
        <option key={opt.value} value={opt.value}>{opt.label}</option>
      ))}
    </select>
  </div>
);
'use client';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Bell, Mail, Calendar, CheckCircle, XCircle, Clock, Trash2, Eye,
  User, GraduationCap, Briefcase, MapPin, Phone, Download, Search, Filter,
  ExternalLink
} from 'lucide-react';

const NotificationsPage = () => {
  const router = useRouter();
  const [notifications, setNotifications] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [companyId, setCompanyId] = useState(null);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [viewMode, setViewMode] = useState('notifications');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const renderSkill = (item) => {
    if (!item) return '';
    if (typeof item === 'string') return item;
    if (typeof item === 'object' && item.name) return item.name;
    if (typeof item === 'object' && item.skill) return item.skill;
    if (typeof item === 'object' && item.language) return item.language;
    return String(item);
  };

  useEffect(() => {
    const findCompanyId = () => {
      if (typeof window === 'undefined') return null;
      
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          if (user.role === 'company' && user.id) {
            return user.id;
          }
        } catch (error) {
          console.error('Error parsing user:', error);
        }
      }
      return null;
    };

    const companyId = findCompanyId();
    setCompanyId(companyId);

    if (companyId) {
      // Fetch both notifications and applications
      Promise.all([
        fetchNotifications(companyId),
        fetchApplications(companyId)
      ]).finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const fetchNotifications = async (companyId) => {
    try {
      const response = await fetch(`/api/notifications?company_id=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setNotifications(data.notifications || []);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  const fetchApplications = async (companyId) => {
    try {
      const response = await fetch(`/api/applications?company_id=${companyId}`);
      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(`/api/applications/${applicationId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setApplications(prev => prev.map(app => 
          app.id === applicationId ? { ...app, status: newStatus } : app
        ));
        if (selectedApplication?.id === applicationId) {
          setSelectedApplication(prev => ({ ...prev, status: newStatus }));
        }
      }
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const markNotificationAsRead = async (notificationId) => {
    try {
      setNotifications(prev => prev.map(notif => 
        notif.id === notificationId ? { ...notif, read: true } : notif
      ));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const handleViewFullProfile = (studentId) => {
    router.push(`/company/company_view/${studentId}`);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'interview': return 'bg-purple-100 text-purple-800';
      case 'accepted': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case 'pending': return 'Pendiente';
      case 'reviewed': return 'Revisada';
      case 'interview': return 'Entrevista';
      case 'accepted': return 'Aceptada';
      case 'rejected': return 'Rechazada';
      default: return status;
    }
  };

  const filteredApplications = applications.filter(application => {
    const matchesSearch = 
      application.student_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      application.internship_title?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || application.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const unreadNotifications = notifications.filter(notif => !notif.read).length;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Cargando...</p>
          </div>
        </div>
      </div>
    );
  }

  // Application Detail View
  if (viewMode === 'application-detail' && selectedApplication) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <button
              onClick={() => setViewMode('notifications')}
              className="p-2 hover:bg-gray-200 rounded-full transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <h1 className="text-2xl font-bold text-gray-900">Perfil del Estudiante</h1>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            {/* Student Header */}
            <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 text-white">
              <div className="flex items-center gap-4">
                {selectedApplication.profile_image_url ? (
                  <img
                    src={selectedApplication.profile_image_url}
                    alt={selectedApplication.student_name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white"
                  />
                ) : (
                  <div className="w-16 h-16 bg-white text-blue-600 rounded-full flex items-center justify-center text-xl font-semibold">
                    {selectedApplication.student_name?.charAt(0) || 'E'}
                  </div>
                )}
                <div>
                  <h2 className="text-2xl font-bold">{selectedApplication.student_name}</h2>
                  <p className="text-blue-100">Aplicó a: {selectedApplication.internship_title}</p>
                </div>
              </div>
            </div>

            {/* Application Details */}
            <div className="p-6 space-y-6">
              {/* Status Management */}
              <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div>
                  <span className="font-semibold text-gray-900">Estado actual:</span>
                  <span className={`ml-2 inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(selectedApplication.status)}`}>
                    {getStatusLabel(selectedApplication.status)}
                  </span>
                </div>
                <select
                  value={selectedApplication.status}
                  onChange={(e) => updateApplicationStatus(selectedApplication.id, e.target.value)}
                  className="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pendiente</option>
                  <option value="reviewed">Marcar como revisada</option>
                  <option value="interview">Programar entrevista</option>
                  <option value="accepted">Aceptar aplicación</option>
                  <option value="rejected">Rechazar aplicación</option>
                </select>
              </div>

              {/* Student Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Información del Estudiante</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span>{selectedApplication.student_email}</span>
                    </div>
                    {selectedApplication.university && (
                      <div className="flex items-center gap-2">
                        <GraduationCap className="w-4 h-4 text-gray-400" />
                        <span>{selectedApplication.university}</span>
                      </div>
                    )}
                    {selectedApplication.career && (
                      <div className="flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-gray-400" />
                        <span>{selectedApplication.career}</span>
                      </div>
                    )}
                    {selectedApplication.semester && (
                      <div>
                        <span className="font-medium">Semestre:</span> {selectedApplication.semester}
                      </div>
                    )}
                    {selectedApplication.gpa && (
                      <div>
                        <span className="font-medium">GPA:</span> {selectedApplication.gpa}
                      </div>
                    )}
                  </div>
                </div>

                {/* Skills & Languages */}
                <div>
                  <h3 className="font-semibold text-gray-900 mb-3">Habilidades e Idiomas</h3>
                  {selectedApplication.skills && selectedApplication.skills.length > 0 && (
                    <div className="mb-4">
                      <h4 className="font-medium text-gray-700 mb-2">Habilidades:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedApplication.skills.map((skill, index) => (
                          <span key={index} className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                            {renderSkill(skill)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  {selectedApplication.languages && selectedApplication.languages.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Idiomas:</h4>
                      <div className="flex flex-wrap gap-1">
                        {selectedApplication.languages.map((language, index) => (
                          <span key={index} className="inline-block bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                            {renderSkill(language)}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={() => window.location.href = `mailto:${selectedApplication.student_email}`}
                  className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  Contactar por Email
                </button>
                <button 
                  onClick={() => handleViewFullProfile(selectedApplication.student_id)}
                  className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                  Ver Perfil Completo
                </button>
                <button className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors">
                  <Download className="w-4 h-4" />
                  Descargar CV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main Notifications/Applications View
  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Aplicaciones de Estudiantes
          </h1>
          <p className="text-gray-600">
            {applications.length === 0 
              ? 'No hay aplicaciones recibidas'
              : `Mostrando ${filteredApplications.length} de ${applications.length} aplicaciones`
            }
          </p>
          {unreadNotifications > 0 && (
            <div className="flex items-center gap-2 mt-2 text-sm text-blue-600">
              <Bell className="w-4 h-4" />
              <span>Tienes {unreadNotifications} notificaciones sin leer</span>
            </div>
          )}
        </div>

        {/* Filters */}
        {applications.length > 0 && (
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por estudiante o pasantía..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900"
                  />
                </div>
              </div>

              {/* Status Filter */}
              <div className="flex gap-2 flex-wrap">
                {[
                  { key: 'all', label: 'Todas' },
                  { key: 'pending', label: 'Pendientes' },
                  { key: 'reviewed', label: 'Revisadas' },
                  { key: 'interview', label: 'Entrevista' },
                  { key: 'accepted', label: 'Aceptadas' },
                  { key: 'rejected', label: 'Rechazadas' },
                ].map(({ key, label }) => (
                  <button
                    key={key}
                    onClick={() => setStatusFilter(key)}
                    className={`px-4 py-2 rounded-lg transition-colors font-medium ${
                      statusFilter === key
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Applications List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {applications.length === 0 ? (
            <div className="text-center py-12">
              <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No hay aplicaciones
              </h3>
              <p className="text-gray-600 mb-4">
                Cuando los estudiantes apliquen a tus pasantías, aparecerán aquí.
              </p>
            </div>
          ) : filteredApplications.length === 0 ? (
            <div className="text-center py-12">
              <Filter className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No se encontraron aplicaciones
              </h3>
              <p className="text-gray-600">
                No hay aplicaciones que coincidan con los filtros actuales.
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-200">
              {filteredApplications.map(application => (
                <div
                  key={application.id}
                  className="p-6 hover:bg-gray-50 transition-colors cursor-pointer"
                  onClick={() => {
                    setSelectedApplication(application);
                    setViewMode('application-detail');
                  }}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      {/* Student Avatar */}
                      <div className="flex-shrink-0">
                        {application.profile_image_url ? (
                          <img
                            src={application.profile_image_url}
                            alt={application.student_name}
                            className="w-12 h-12 rounded-full object-cover"
                          />
                        ) : (
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                            {application.student_name?.charAt(0) || 'E'}
                          </div>
                        )}
                      </div>

                      {/* Application Details */}
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-gray-900 text-lg">
                            {application.student_name}
                          </h3>
                          <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(application.status)}`}>
                            {getStatusLabel(application.status)}
                          </span>
                        </div>

                        <p className="text-gray-700 mb-2">
                          Aplicó a: <span className="font-semibold">{application.internship_title}</span>
                        </p>

                        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                          {application.university && (
                            <div className="flex items-center gap-1">
                              <GraduationCap className="w-4 h-4" />
                              {application.university}
                            </div>
                          )}
                          {application.career && (
                            <div className="flex items-center gap-1">
                              <Briefcase className="w-4 h-4" />
                              {application.career}
                            </div>
                          )}
                          {application.semester && (
                            <div>Semestre: {application.semester}</div>
                          )}
                        </div>

                        {application.skills && application.skills.length > 0 && (
                          <div className="flex flex-wrap gap-1 mt-2">
                            {application.skills.slice(0, 4).map((skill, index) => (
                              <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                {renderSkill(skill)}
                              </span>
                            ))}
                            {application.skills.length > 4 && (
                              <span className="inline-block bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded">
                                +{application.skills.length - 4} más
                              </span>
                            )}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="flex gap-2 ml-4">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedApplication(application);
                          setViewMode('application-detail');
                        }}
                        className="p-2 text-blue-600 hover:text-blue-800 rounded-full hover:bg-blue-50"
                        title="Ver resumen rápido"
                      >
                        <Eye className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewFullProfile(application.student_id);
                        }}
                        className="p-2 text-purple-600 hover:text-purple-800 rounded-full hover:bg-purple-50"
                        title="Ver perfil completo"
                      >
                        <ExternalLink className="w-5 h-5" />
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          window.location.href = `mailto:${application.student_email}`;
                        }}
                        className="p-2 text-green-600 hover:text-green-800 rounded-full hover:bg-green-50"
                        title="Enviar email"
                      >
                        <Mail className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-200">
                    <div className="text-sm text-gray-500">
                      Aplicó el {new Date(application.applied_at).toLocaleDateString('es-ES')}
                    </div>
                    
                    {/* Quick Status Update */}
                    <div className="flex gap-2">
                      <select
                        value={application.status}
                        onChange={(e) => {
                          e.stopPropagation();
                          updateApplicationStatus(application.id, e.target.value);
                        }}
                        className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pendiente</option>
                        <option value="reviewed">Revisada</option>
                        <option value="interview">Entrevista</option>
                        <option value="accepted">Aceptar</option>
                        <option value="rejected">Rechazar</option>
                      </select>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default NotificationsPage;
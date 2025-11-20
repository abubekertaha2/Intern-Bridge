'use client';

import React from 'react';
import ProfileLayout from '@/components/layout/ProfileLayout';


const mergeClasses = (...classes) => {
  return classes.filter(Boolean).join(' ');
};

const StarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 fill-current" viewBox="0 0 20 20">
    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.691h4.168c.969 0 1.371 1.24.588 1.81l-3.376 2.455a1 1 0 00-.364 1.118l1.287 3.957c.3.921-.755 1.688-1.54 1.118l-3.376-2.455a1 1 0 00-1.176 0l-3.376 2.455c-.785.57-1.84-.197-1.54-1.118l1.287-3.957a1 1 0 00-.364-1.118L2.096 9.385c-.783-.57-.381-1.81.588-1.81h4.168a1 1 0 00.95-.691l1.286-3.957z" />
  </svg>
);

const Dropdown = ({ options, placeholder, className, onChange }) => {
  const [selectedValue, setSelectedValue] = React.useState('');

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

const InstitutionStatsCard = ({ value, label }) => (
  <div className="bg-white p-4 rounded-lg shadow-md flex-1 text-center">
    <p className="text-3xl font-extrabold text-[#1D2939]">{value}</p>
    <p className="text-sm text-gray-500 mt-1">{label}</p>
  </div>
);

const ActivityLog = ({ logs }) => (
    <div className="bg-white p-6 rounded-xl shadow-md">
        <h4 className="text-lg font-bold text-[#1D2939] mb-4">Actividad Reciente</h4>
        <div className="text-sm text-gray-700 space-y-4">
            {logs.map((log, index) => (
                <div key={index}>
                    <p className="font-semibold text-xs text-[#DB1320] mb-1">{log.title}</p>
                    <ul className="list-disc list-inside space-y-1">
                        {log.items.map((item, i) => (
                            <li key={i} className="text-gray-600 ml-2">{item}</li>
                        ))}
                    </ul>
                </div>
            ))}
        </div>
    </div>
);

const InstitutionalDashboard = () => {
    // Mock Data for Dashboard
    const stats = [
        { value: '1,247', label: 'Estudiantes Activos' },
        { value: '89', label: 'Pasantías Activas' },
        { value: '23', label: 'Contenido Publicado' },
        { value: '12', label: 'Notificaciones Nuevas' },
    ];
    
    const activityLogs = [
        { title: 'HOY', items: ['15 estudiantes aplicaron a pasantías • Hace 2 horas', 'Video de orientación visto 87 veces • Hace 4 horas'] },
        { title: 'AYER', items: ['Nuevo contenido publicado • Viernes', 'Mensaje de bienvenida • Recién creados', 'Estudiantes contactados • En diferentes empresas'] },
        { title: 'ESTA SEMANA', items: ['24 nuevas aceptaciones • Récord semanal', 'Contenido más popular • Vídeo de orientación'] },
    ];

    const RecentNotificationItem = ({ name, detail, time, status }) => (
        <div className="flex justify-between items-center py-2 border-b last:border-b-0">
            <div>
                <p className="font-semibold text-sm text-[#1D2939]">{name}</p>
                <p className="text-xs text-gray-500">{detail}</p>
                <p className="text-[10px] text-gray-400">{time}</p>
            </div>
            <span className={mergeClasses(
                "text-[10px] font-bold px-2 py-0.5 rounded-full",
                status === 'Nueva' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
            )}>
                {status === 'Nueva' ? 'Nueva' : 'Completada'}
            </span>
        </div>
    );

    const QuickActionItem = ({ label, detail, color, isVideo = false }) => (
        <div className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
            <div className="flex items-center gap-3">
                <div className={mergeClasses("p-2 rounded-full", color === 'red' ? 'bg-red-200 text-red-700' : color === 'green' ? 'bg-green-200 text-green-700' : 'bg-blue-200 text-blue-700')}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        {isVideo ? (
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                        ) : (
                            <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zm0 10a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zm0 10a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        )}
                    </svg>
                </div>
                <div>
                    <p className="font-medium text-sm text-[#1D2939]">{label}</p>
                    <p className="text-xs text-gray-500">{detail}</p>
                </div>
            </div>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
        </div>
    );
    
    return (
        <div className="flex flex-col lg:flex-row gap-8 items-start w-full">
            
            {/* LEFT COLUMN: Dashboard Institucional */}
            <div className="w-full lg:w-2/3 space-y-8">
                {/* Dashboard Header */}
                <div className="bg-[#407DC3] w-full p-6 rounded-xl shadow-2xl relative">
                    <div className="flex items-start gap-6">
                        <div className="flex-shrink-0">
                            <div className="w-20 h-20 bg-[#1D2939] rounded-full flex items-center justify-center text-white text-4xl font-bold">
                                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M12 2L1 21H23L12 2Z" stroke="#DB1320" strokeWidth="2" strokeLinejoin="round" fill="none"/>
                                    <path d="M12 6L7 15H17L12 6Z" stroke="#DB1320" strokeWidth="2" strokeLinejoin="round" fill="#DB1320"/>
                                </svg>
                            </div>
                        </div>
                        <div className="flex-grow">
                            <h2 className="text-3xl font-extrabold text-[#1D2939] flex items-center gap-3">
                                Dashboard Institucional
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-gray-500 cursor-pointer hover:text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                            </h2>
                            <p className="text-gray-600 mt-1">
                                Gestiona notificaciones, crea contenido y monitorea la actividad de tus estudiantes
                            </p>
                            <div className="flex items-center gap-4 mt-3 text-sm">
                                <span className="text-[#1D2939] font-medium flex items-center gap-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M6.267 18.04a2 2 0 001.347 0c.451-.122.95-.31 1.401-.568a24.288 24.288 0 004.981-4.98c.258-.451.446-.95.568-1.401a2 2 0 000-1.347c-.122-.451-.31-.95-.568-1.401a24.288 24.288 0 00-4.98-4.98c-.451-.258-.95-.446-1.401-.568a2 2 0 00-1.347 0c-.451.122-.95.31-1.401.568a24.288 24.288 0 00-4.98 4.98c-.258.451-.446.95-.568 1.401a2 2 0 000 1.347c.122.451.31.95.568 1.401a24.288 24.288 0 004.98 4.98c.451.258.95.446 1.401.568z" clipRule="evenodd" />
                                    </svg>
                                    Institucional Verificado
                                </span>
                                <span className="text-yellow-700 font-medium bg-yellow-100 px-2 py-0.5 rounded-full">
                                    Premium Partner
                                </span>
                                <button className="text-[#DB1320] font-bold hover:text-red-700 transition-colors">
                                    Crear Contenido
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="flex flex-wrap gap-4 justify-between">
                    {stats.map((stat, index) => (
                        <InstitutionStatsCard key={index} value={stat.value} label={stat.label} />
                    ))}
                </div>

                {/* Notifications and Quick Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="bg-white p-6 rounded-xl shadow-md">
                        <div className="flex justify-between items-center mb-4">
                            <h4 className="text-lg font-bold text-[#1D2939]">Notificaciones Recientes</h4>
                            <button className="text-sm font-semibold text-[#DB1320] hover:text-red-700">Ver Todas</button>
                        </div>
                        <div className="space-y-2">
                            <RecentNotificationItem 
                                name="María González aceptada en TechCorp" 
                                detail="Hace 2 horas • Desarrollo de Software" 
                                time="Hace 2 horas" 
                                status="Nueva" 
                            />
                            <RecentNotificationItem 
                                name="Carlos Méndez aceptado en FinanceHub" 
                                detail="Hace 5 horas • Análisis Financiero" 
                                time="Hace 5 horas" 
                                status="Nueva" 
                            />
                            <RecentNotificationItem 
                                name="Ana Ruíz completó pasantía en DataLab" 
                                detail="Ayer • Ciencia de Datos" 
                                time="Ayer" 
                                status="Completada" 
                            />
                        </div>
                    </div>
                    
                    <div className="bg-white p-6 rounded-xl shadow-md space-y-4">
                        <h4 className="text-lg font-bold text-[#1D2939]">Acciones Rápidas</h4>
                        <p className="text-sm text-gray-500">Crea y gestiona contenido educativo</p>
                        
                        <div className="grid grid-cols-2 gap-3">
                            <button className="bg-[#DB1320] text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors">
                                Subir Vídeo
                            </button>
                            <button className="bg-[#1D2939] text-white px-4 py-2 rounded-md font-medium hover:bg-gray-700 transition-colors">
                                Subir Imagen
                            </button>
                        </div>

                        <QuickActionItem 
                            label="Orientación_2024.mp4"
                            detail="247 vistas"
                            color="green"
                            isVideo={true}
                        />
                        <QuickActionItem 
                            label="Infografía_Proceso.jpg"
                            detail="892 vistas"
                            color="blue"
                        />
                    </div>
                </div>
                
                {/* Recent Activity */}
                <ActivityLog logs={activityLogs} />
            </div>

            {/* RIGHT COLUMN: Formulario de Práctica */}
            <div className="w-full lg:w-1/3 p-6 rounded-xl shadow-2xl bg-white sticky top-10">
                <h3 className="text-2xl font-bold text-[#1D2939] mb-4">Crear Nuevo Contenido</h3>
                <p className="text-sm text-gray-600 mb-6">
                    Sube videos, imágenes o documentos que aparecerán en el foro principal
                </p>

                <div className="space-y-4">
                    <Dropdown 
                        options={[{ label: 'Video', value: 'video' }, { label: 'Documento', value: 'doc' }]}
                        placeholder="Seleccionar tipo"
                    />
                    <Dropdown 
                        options={[{ label: 'Desarrollo Web', value: 'web' }, { label: 'Finanzas', value: 'finance' }]}
                        placeholder="Seleccionar categoría"
                    />

                    <input
                        type="text"
                        placeholder="Título del contenido"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1D2939] focus:border-[#1D2939]"
                    />
                    <textarea
                        placeholder="Descripción"
                        rows="4"
                        className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-[#1D2939] focus:border-[#1D2939] resize-none"
                    ></textarea>
                </div>
                
                {/* File Upload Area */}
                <div className="mt-6 border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50">
                    <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                    </svg>
                    <p className="text-sm text-gray-500 mt-2">
                        Arrastra y suelta tu archivo aquí
                    </p>
                    <button className="mt-3 bg-[#DB1320] text-white px-4 py-2 rounded-md font-medium hover:bg-red-700 transition-colors text-sm">
                        Seleccionar Archivo
                    </button>
                    <p className="text-xs text-gray-400 mt-2">
                        Máximo 100MB • MP4, JPG, PNG, PDF
                    </p>
                </div>

                <div className="mt-6 space-y-3">
                    <button className="w-full bg-[#1D2939] text-white px-6 py-3 rounded-md font-medium hover:bg-gray-700 transition-colors">
                        Publicar en Foro Principal
                    </button>
                    <button className="w-full bg-transparent text-gray-700 border border-gray-300 px-6 py-3 rounded-md font-medium hover:bg-gray-100 transition-colors">
                        Guardar como Borrador
                    </button>
                </div>

            </div>
        </div>
    );
};

// --- MAIN APP COMPONENT ---

const App = () => {
    return (
        <ProfileLayout>
            <InstitutionalDashboard />
        </ProfileLayout>
    );
};

export default App;
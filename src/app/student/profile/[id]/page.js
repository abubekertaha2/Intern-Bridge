'use client'; 

import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'next/navigation';
import ProfileLayout from '@/components/layout/ProfileLayout'; 

import { 
  Edit2, 
  Download, 
  FileText, 
  BarChart3, 
  Globe, 
  CheckCircle, 
  Camera, 
  X,
  MapPin,
  Calendar,
  Users,
  Mail,
  Phone,
  GraduationCap,
  BookOpen,
  Award,
  Languages,
  TrendingUp,
  User,
  Briefcase,
  Map,
  Plus,
  Save,
  RotateCcw
} from 'lucide-react';

// Predefined Data
const PREDEFINED_SKILLS = [
  "JavaScript", "Python", "Java", "C++", "React", "Node.js", 
  "HTML/CSS", "SQL", "MongoDB", "Git", "AWS", "Docker",
  "React Native", "Vue.js", "Angular", "TypeScript", "PHP",
  "Ruby", "Go", "Swift", "Kotlin", "R", "Data Analysis",
  "Machine Learning", "UI/UX Design", "Figma", "Photoshop",
  "Illustrator", "After Effects", "Premiere Pro", "Blender",
  "Unity", "Unreal Engine", "Android Development", "iOS Development",
  "Firebase", "MySQL", "PostgreSQL", "Redis", "GraphQL",
  "REST APIs", "Microservices", "CI/CD", "Jenkins", "Kubernetes",
  "TensorFlow", "PyTorch", "Pandas", "NumPy", "Scikit-learn"
];

const PREDEFINED_LANGUAGES = [
  "Spanish", "English", "French", "German", "Italian", 
  "Portuguese", "Chinese", "Japanese", "Korean", "Arabic",
  "Russian", "Dutch", "Swedish", "Hindi", "Turkish",
  "Polish", "Ukrainian", "Greek", "Hebrew", "Thai"
];

const LANGUAGE_LEVELS = [
  "A1 - Beginner",
  "A2 - Elementary", 
  "B1 - Intermediate",
  "B2 - Upper Intermediate", 
  "C1 - Advanced", 
  "C2 - Proficient", 
  "Native"
];

// Icons
const Badge = ({ className = "", children }) => (
  <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors ${className}`}>
    {children}
  </span>
);

const Button = ({ children, className = "", size, variant, ...props }) => {
    let baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none";
    let sizeClasses = "h-10 py-2 px-4";
    if (size === "sm") sizeClasses = "h-8 px-3 text-xs";
    let variantClasses = "shadow-sm"; 
    if (variant === "outline") variantClasses = "border border-gray-300 hover:bg-gray-50";

    return (
        <button className={`${baseClasses} ${sizeClasses} ${variantClasses} ${className}`} {...props}>
            {children}
        </button>
    );
};

const EditField = ({ label, value, onChange, type = "text", placeholder }) => (
  <div>
    <label className="text-[#787878] text-xs block mb-1">{label}</label>
    <input
      type={type}
      value={value ?? ''} 
      onChange={onChange}
      placeholder={placeholder}
      className="w-full p-2 border border-gray-300 rounded text-sm text-[#1c274d] focus:outline-none focus:ring-2 focus:ring-[#407dc3]"
    />
  </div>
);

// Skills Selector Component
const SkillsSelector = ({ selectedSkills, onSkillsChange }) => {
  const [search, setSearch] = useState('');

  const filteredSkills = PREDEFINED_SKILLS.filter(skill =>
    skill.toLowerCase().includes(search.toLowerCase())
  );

  const toggleSkill = (skill) => {
    if (selectedSkills.includes(skill)) {
      onSkillsChange(selectedSkills.filter(s => s !== skill));
    } else {
      onSkillsChange([...selectedSkills, skill]);
    }
  };

  return (
    <div>
      <div className="mb-3">
        <input
          type="text"
          placeholder="Search skills..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded text-sm"
        />
      </div>

      {/* Selected Skills */}
      <div className="flex flex-wrap gap-2 mb-4 min-h-[40px]">
        {selectedSkills.map(skill => (
          <Badge key={skill} className="bg-[#407dc3] text-white flex items-center gap-1">
            {skill}
            <X 
              className="w-3 h-3 cursor-pointer" 
              onClick={() => toggleSkill(skill)}
            />
          </Badge>
        ))}
        {selectedSkills.length === 0 && (
          <p className="text-gray-500 text-sm">No skills selected. Search and select skills above.</p>
        )}
      </div>

      {/* Available Skills */}
      <div className="max-h-40 overflow-y-auto border border-gray-200 rounded">
        {filteredSkills.map(skill => (
          <div
            key={skill}
            className={`p-2 text-sm cursor-pointer border-b border-gray-100 hover:bg-gray-50 ${
              selectedSkills.includes(skill) ? 'bg-blue-50 border-blue-200' : ''
            }`}
            onClick={() => toggleSkill(skill)}
          >
            <div className="flex items-center justify-between">
              <span>{skill}</span>
              {selectedSkills.includes(skill) && (
                <CheckCircle className="w-4 h-4 text-green-500" />
              )}
            </div>
          </div>
        ))}
        {filteredSkills.length === 0 && (
          <div className="p-4 text-center text-gray-500 text-sm">
            No skills found matching "{search}"
          </div>
        )}
      </div>
    </div>
  );
};

// Languages Selector Component
const LanguagesSelector = ({ selectedLanguages, onLanguagesChange }) => {
  const addLanguage = () => {
    onLanguagesChange([
      ...selectedLanguages,
      { name: "", level: "B1 - Intermediate" }
    ]);
  };

  const updateLanguage = (index, field, value) => {
    const updated = [...selectedLanguages];
    updated[index] = { ...updated[index], [field]: value };
    onLanguagesChange(updated);
  };

  const removeLanguage = (index) => {
    onLanguagesChange(selectedLanguages.filter((_, i) => i !== index));
  };

  return (
    <div>
      {selectedLanguages.map((lang, index) => (
        <div key={index} className="flex gap-2 mb-3 items-end">
          <div className="flex-1">
            <label className="text-xs text-gray-600 block mb-1">Language</label>
            <select
              value={lang.name}
              onChange={(e) => updateLanguage(index, 'name', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              <option value="">Select a language</option>
              {PREDEFINED_LANGUAGES.map(language => (
                <option key={language} value={language}>{language}</option>
              ))}
            </select>
          </div>
          
          <div className="flex-1">
            <label className="text-xs text-gray-600 block mb-1">Proficiency Level</label>
            <select
              value={lang.level}
              onChange={(e) => updateLanguage(index, 'level', e.target.value)}
              className="w-full p-2 border border-gray-300 rounded text-sm"
            >
              {LANGUAGE_LEVELS.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>
          
          <button
            type="button"
            onClick={() => removeLanguage(index)}
            className="p-2 text-red-500 hover:text-red-700 mb-1"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      ))}
      
      <button
        type="button"
        onClick={addLanguage}
        className="flex items-center gap-2 text-[#407dc3] hover:text-[#346da6] text-sm mt-2"
      >
        <Plus className="w-4 h-4" />
        Add Language
      </button>

      {selectedLanguages.length === 0 && (
        <p className="text-gray-500 text-sm mt-2">No languages added. Click "Add Language" to get started.</p>
      )}
    </div>
  );
};

// Individual Section Components with their own edit state
const PersonalInfoSection = ({ 
  student, 
  editedStudent, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onFieldChange 
}) => {
  const formatSemester = (semester) => {
    const num = typeof semester === 'number' ? semester : parseInt(semester || 0);
    return isNaN(num) ? '0' : num.toString();
  };

  return (
    <div className="border border-[#d9d9d9] bg-[#CFE5FF] rounded-lg p-4 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1c274d] flex items-center gap-2">
          <User className="w-5 h-5 text-[#407dc3]" />
          Información Personal
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="p-1 text-green-600 hover:text-green-700"
                title="Guardar"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="p-1 text-red-500 hover:text-red-700"
                title="Cancelar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="p-1 text-[#407dc3] hover:text-[#1c274d]"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm w-full">
        {isEditing ? (
          <>
            <EditField
              label="Correo electrónico (Opcional)"
              value={editedStudent?.optional_email ?? ''}
              onChange={(e) => onFieldChange('optional_email', e.target.value)}
              type="email"
              placeholder="correo@ejemplo.com"
            />
            <EditField
              label="Teléfono"
              value={editedStudent?.phone ?? ''}
              onChange={(e) => onFieldChange('phone', e.target.value)}
              type="tel"
              placeholder="+34 123 456 789"
            />
            <div>
              <p className="text-[#787878] text-xs">Correo electrónico (Principal)</p>
              <p className="text-[#1c274d] font-medium">{student?.email || 'No especificado'}</p>
              <p className="text-xs text-gray-500">No editable</p>
            </div>
            <EditField
              label="Año Académico"
              value={formatSemester(editedStudent?.semester)}
              onChange={(e) => onFieldChange('semester', e.target.value)}
              type="number"
              placeholder="4"
            />
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

const AcademicInfoSection = ({ 
  student, 
  editedStudent, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onFieldChange 
}) => {
  const formatGPA = (gpa) => {
    const num = typeof gpa === 'number' ? gpa : parseFloat(gpa || 0);
    return isNaN(num) ? '0.0' : num.toFixed(1);
  };

  return (
    <div className="border bg-[#CFE5FF] border-[#d9d9d9] rounded-lg p-4 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1c274d] flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#407dc3]" />
          Información Académica
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="p-1 text-green-600 hover:text-green-700"
                title="Guardar"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="p-1 text-red-500 hover:text-red-700"
                title="Cancelar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="p-1 text-[#407dc3] hover:text-[#1c274d]"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm w-full">
        {isEditing ? (
          <>
            <EditField
              label="Universidad"
              value={editedStudent?.university ?? ''}
              onChange={(e) => onFieldChange('university', e.target.value)}
              placeholder="Universidad Complutense Madrid"
            />
            <EditField
              label="Carrera"
              value={editedStudent?.career ?? ''}
              onChange={(e) => onFieldChange('career', e.target.value)}
              placeholder="Ingeniería en Sistemas"
            />
            <EditField
              label="Promedio (GPA)"
              value={formatGPA(editedStudent?.gpa)}
              onChange={(e) => onFieldChange('gpa', e.target.value)}
              type="number"
              step="0.1"
              placeholder="8.5"
            />
            <div>
              <p className="text-[#787878] text-xs">Fecha de Graduación</p>
              <p className="text-[#1c274d] font-medium">Junio 2025</p>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
      </div>
    </div>
  );
};

const SkillsSection = ({ 
  student, 
  editedStudent, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onFieldChange 
}) => {
  return (
    <div className="border border-[#d9d9d9] bg-[#CFE5FF] rounded-lg p-4 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1c274d] flex items-center gap-2">
          <Award className="w-5 h-5 text-[#407dc3]" />
          Habilidades y Competencias
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="p-1 text-green-600 hover:text-green-700"
                title="Guardar"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="p-1 text-red-500 hover:text-red-700"
                title="Cancelar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="p-1 text-[#407dc3] hover:text-[#1c274d]"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <SkillsSelector
          selectedSkills={editedStudent?.skills || []}
          onSkillsChange={(skills) => onFieldChange('skills', skills)}
        />
      ) : (
        <div className="flex flex-wrap gap-2">
          {student?.skills?.map((skill) => (
            <Badge key={skill} className="bg-[#407dc3] hover:bg-[#346da6] transition text-white text-xs cursor-pointer">
              {skill}
            </Badge>
          ))}
          {(!student?.skills || student.skills.length === 0) && (
            <p className="text-gray-500 text-sm">No se han agregado habilidades. Haz clic en editar para agregar habilidades.</p>
          )}
        </div>
      )}
    </div>
  );
};

const LanguagesSection = ({ 
  student, 
  editedStudent, 
  isEditing, 
  onEdit, 
  onSave, 
  onCancel, 
  onFieldChange 
}) => {
  return (
    <div className="border bg-[#CFE5FF] border-[#d9d9d9] rounded-lg p-4 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1c274d] flex items-center gap-2">
          <Languages className="w-5 h-5 text-[#407dc3]" />
          Idiomas y Niveles
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
            <>
              <button
                onClick={onSave}
                className="p-1 text-green-600 hover:text-green-700"
                title="Guardar"
              >
                <Save className="w-4 h-4" />
              </button>
              <button
                onClick={onCancel}
                className="p-1 text-red-500 hover:text-red-700"
                title="Cancelar"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            <button
              onClick={onEdit}
              className="p-1 text-[#407dc3] hover:text-[#1c274d]"
              title="Editar"
            >
              <Edit2 className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
      
      {isEditing ? (
        <LanguagesSelector
          selectedLanguages={editedStudent?.languages || []}
          onLanguagesChange={(languages) => onFieldChange('languages', languages)}
        />
      ) : (
        <div className="space-y-3">
          {student?.languages?.map((lang, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-b-0">
              <span className="text-[#1c274d] font-medium">{lang.name}</span>
              <Badge className="bg-[#407dc3] text-white text-xs">
                {lang.level}
              </Badge>
            </div>
          ))}
          {(!student?.languages || student.languages.length === 0) && (
            <p className="text-gray-500 text-sm">No se han agregado idiomas. Haz clic en editar para agregar idiomas.</p>
          )}
        </div>
      )}
    </div>
  );
};

const DocumentsSection = ({ 
  student, 
  onCvUpload, 
  onCvRemove, 
  cvFile, 
  uploading 
}) => {
  const fileInputRef = useRef(null);

  const handleCvUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'image/png', 'image/jpeg', 'image/jpg'];
    if (!allowedTypes.includes(file.type)) {
      alert('Por favor, sube un archivo PDF, PNG o JPG.');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      alert('El archivo es demasiado grande. Máximo 5MB.');
      return;
    }

    onCvUpload(file);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDownloadCV = () => {
    if (cvFile) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(cvFile);
      link.download = cvFile.name;
      link.click();
    }
  };

  return (
    <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm w-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="font-semibold text-[#1c274d] flex items-center gap-2">
          <FileText className="w-5 h-5 text-[#407dc3]" />
          Documentos
        </h2>
        <Edit2 className="w-4 h-4 text-[#407dc3] cursor-pointer hover:text-[#1c274d]" />
      </div>
      <div className="space-y-3">
        {/* Student Card */}
        <div className="bg-[#cfe5ff] rounded p-3 flex items-center justify-between shadow-inner">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-[#407dc3] flex-shrink-0" />
            <div>
              <p className="text-sm font-medium text-[#1c274d]">{student?.student_card || 'No hay documento cargado'}</p>
              <p className="text-xs text-[#787878]">1.3 MB • Verificado ✓</p>
            </div>
          </div>
          <Download className="w-5 h-5 text-[#407dc3] flex-shrink-0 cursor-pointer hover:scale-110 transition" />
        </div>
        
        {/* CV Upload Section */}
        {cvFile ? (
          <div className="bg-green-50 border border-green-200 rounded p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600 flex-shrink-0" />
              <div>
                <p className="text-sm font-medium text-green-800">{cvFile.name}</p>
                <p className="text-xs text-green-600">
                  {(cvFile.size / (1024 * 1024)).toFixed(2)} MB • Subido ✓
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <Download 
                className="w-5 h-5 text-green-600 flex-shrink-0 cursor-pointer hover:scale-110 transition" 
                onClick={handleDownloadCV}
              />
              <button 
                onClick={onCvRemove}
                className="text-red-500 hover:text-red-700 text-xs"
              >
                Eliminar
              </button>
            </div>
          </div>
        ) : (
          <>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept=".pdf,.png,.jpg,.jpeg"
              className="hidden"
            />
            <div 
              className="border-2 border-dashed border-[#407dc3] rounded p-4 text-center cursor-pointer hover:bg-[#f9faff] transition"
              onClick={handleCvUploadClick}
            >
              {uploading ? (
                <div className="flex flex-col items-center">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#407dc3] mb-2"></div>
                  <p className="text-xs text-[#787878]">Subiendo CV...</p>
                </div>
              ) : (
                <>
                  <p className="text-xs text-[#787878] mb-1">Haz clic para subir tu CV</p>
                  <p className="text-xs text-[#787878]">PDF, PNG, JPG (Max. 5MB)</p>
                </>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

const UserProfileSection = ({ 
  student, 
  onSectionSave, 
  editedStudent, 
  onFieldChange 
}) => {
    const fileInputRef = useRef(null);
    const profileImageInputRef = useRef(null);
    const [cvFile, setCvFile] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [profileImage, setProfileImage] = useState(null);
    const [uploadingProfileImage, setUploadingProfileImage] = useState(false);
    
    // Individual section edit states
    const [editingSection, setEditingSection] = useState(null);
    const [sectionEditedData, setSectionEditedData] = useState({});

    const getInitials = (name) => {
        if (!name) return '?';
        const parts = name.split(' ').filter(p => p.length > 0);
        if (parts.length >= 2) {
            return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
        }
        return name.charAt(0).toUpperCase();
    };

    const initials = getInitials(student?.full_name);

    // Calculate profile completion percentage
    const calculateProfileCompletion = () => {
        let completedItems = 0;
        const totalItems = 7;
        
        if (profileImage || student?.profile_image_url) completedItems++;
        if (student?.student_card) completedItems++;
        if (cvFile) completedItems++;
        if (student?.full_name && student?.email && student?.phone) completedItems++;
        if (student?.university && student?.career) completedItems++;
        if (student?.skills && student.skills.length > 0) completedItems++;
        if (student?.languages && student.languages.length > 0) completedItems++;
        
        return Math.round((completedItems / totalItems) * 100);
    };

    const profileCompletion = calculateProfileCompletion();

    // Section edit handlers
    const handleSectionEdit = (section, data) => {
        setEditingSection(section);
        setSectionEditedData({...data});
    };

    const handleSectionSave = async (section) => {
        try {
            await onSectionSave(section, sectionEditedData);
            setEditingSection(null);
            setSectionEditedData({});
        } catch (error) {
            console.error('Error saving section:', error);
        }
    };

    const handleSectionCancel = (section) => {
        setEditingSection(null);
        setSectionEditedData({});
    };

    const handleSectionFieldChange = (field, value) => {
        setSectionEditedData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    // Profile Image Upload Functions
    const handleProfileImageClick = () => {
        profileImageInputRef.current?.click();
    };

    const handleProfileImageChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/gif', 'image/webp'];
        const fileType = file.type.toLowerCase();
        
        if (!allowedTypes.includes(fileType)) {
            alert('Por favor, sube una imagen JPG, PNG, GIF o WEBP.');
            return;
        }

        const maxSize = 5 * 1024 * 1024;
        if (file.size > maxSize) {
            alert('La imagen es demasiado grande. Máximo 5MB.');
            return;
        }

        setUploadingProfileImage(true);
        
        try {
            const reader = new FileReader();
            
            reader.onload = (e) => {
                const imageUrl = e.target.result;
                const img = new Image();
                img.onload = () => {
                    setProfileImage({
                        file: file,
                        url: imageUrl,
                        name: file.name,
                        size: file.size,
                        type: file.type
                    });
                    setUploadingProfileImage(false);
                };
                
                img.onerror = () => {
                    setUploadingProfileImage(false);
                    alert('Error al verificar la imagen. Por favor, intenta con otra.');
                };
                
                img.src = imageUrl;
            };
            
            reader.onerror = () => {
                setUploadingProfileImage(false);
                alert('Error al leer el archivo.');
            };
            
            reader.readAsDataURL(file);
            
        } catch (error) {
            console.error('Error processing profile image:', error);
            setUploadingProfileImage(false);
            alert('Error al procesar la imagen. Por favor, intenta de nuevo.');
        }
    };

    const removeProfileImage = () => {
        setProfileImage(null);
        if (profileImageInputRef.current) {
            profileImageInputRef.current.value = '';
        }
    };

    // CV Upload Functions
    const handleCvUpload = async (file) => {
        setUploading(true);
        
        try {
            await new Promise(resolve => setTimeout(resolve, 1500));
            
            setCvFile({
                name: file.name,
                size: file.size,
                type: file.type,
                lastModified: file.lastModified
            });
            
            console.log('CV file uploaded successfully:', file.name);
            
        } catch (error) {
            console.error('Error uploading CV:', error);
            alert('Error al subir el CV. Por favor, intenta de nuevo.');
        } finally {
            setUploading(false);
        }
    };

    const handleCvRemove = () => {
        setCvFile(null);
    };

    const getCompletionItems = () => {
        const items = [
            {
                text: "Foto de perfil",
                completed: !!(profileImage || student?.profile_image_url),
                required: true
            },
            {
                text: "Carnet Estudiante",
                completed: !!student?.student_card,
                required: true
            },
            {
                text: "Subir CV actualizado",
                completed: !!cvFile,
                required: true
            },
            {
                text: "Información personal completa",
                completed: !!(student?.full_name && student?.email && student?.phone),
                required: true
            },
            {
                text: "Información académica completa",
                completed: !!(student?.university && student?.career),
                required: true
            },
            {
                text: "Habilidades agregadas",
                completed: !!(student?.skills && student.skills.length > 0),
                required: true
            },
            {
                text: "Idiomas agregados",
                completed: !!(student?.languages && student.languages.length > 0),
                required: true
            }
        ];
        
        return items;
    };

    const completionItems = getCompletionItems();

    return (
        <div className="bg-white rounded-lg overflow-hidden shadow-2xl w-full max-w-full">
            <div className="bg-[#407dc3] px-6 py-8 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between">
                <div className="flex items-center gap-6">
                    {/* Profile Image with Upload Functionality */}
                    <div className="relative">
                        <div 
                            className="w-32 h-32 rounded-full bg-[#cfe5ff] flex items-center justify-center flex-shrink-0 border-4 border-white cursor-pointer hover:border-[#cfe5ff] transition-all duration-300 overflow-hidden group shadow-lg"
                            onClick={handleProfileImageClick}
                        >
                            {profileImage ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img 
                                        src={profileImage.url} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            console.error('Error loading uploaded image');
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : student?.profile_image_url ? (
                                <div className="w-full h-full flex items-center justify-center">
                                    <img 
                                        src={student.profile_image_url} 
                                        alt="Profile" 
                                        className="w-full h-full object-cover rounded-full"
                                        onError={(e) => {
                                            console.error('Error loading student profile image');
                                            e.target.style.display = 'none';
                                        }}
                                    />
                                </div>
                            ) : (
                                <span className="text-[#407dc3] text-3xl font-bold">{initials}</span>
                            )}
                            
                            {/* Upload Overlay */}
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-300 flex flex-col items-center justify-center rounded-full pointer-events-none">
                                <Camera className="w-8 h-8 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 mb-1" />
                                <span className="text-white text-xs font-semibold opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-center">
                                    {profileImage ? 'Cambiar foto' : 'Subir foto'}
                                </span>
                            </div>
                        </div>
                        
                        {profileImage && (
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    removeProfileImage();
                                }}
                                className="absolute -top-2 -right-2 w-8 h-8 bg-red-500 rounded-full flex items-center justify-center text-white hover:bg-red-600 transition-colors shadow-lg border-2 border-white"
                                title="Eliminar foto"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        )}
                        
                        {uploadingProfileImage && (
                            <div className="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                                <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-white"></div>
                                <span className="text-white text-xs absolute bottom-2">Subiendo...</span>
                            </div>
                        )}
                        
                        <input
                            type="file"
                            ref={profileImageInputRef}
                            onChange={handleProfileImageChange}
                            accept=".jpg,.jpeg,.png,.gif,.webp,image/jpeg,image/png,image/gif,image/webp"
                            className="hidden"
                        />
                    </div>
                    
                    <div>
                        <h1 className="text-2xl font-bold">
                            {student?.full_name || 'Nombre no disponible'}
                        </h1>
                        <p className="text-[#cfe5ff] text-sm">
                            {`${student?.career || 'Carrera no especificada'} | ${student?.university || 'Universidad no especificada'}`}
                        </p>
                        <Badge className="bg-[#1c274d] text-white text-xs mt-2">Perfil Verificado</Badge>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 p-6 w-full">
                <div className="lg:col-span-2 space-y-6 w-full">
                    {/* Información Personal */}
                    <PersonalInfoSection
                        student={student}
                        editedStudent={editingSection === 'personal' ? sectionEditedData : editedStudent}
                        isEditing={editingSection === 'personal'}
                        onEdit={() => handleSectionEdit('personal', {
                            optional_email: student?.optional_email || '',
                            phone: student?.phone || '',
                            semester: student?.semester || 0
                        })}
                        onSave={() => handleSectionSave('personal')}
                        onCancel={() => handleSectionCancel('personal')}
                        onFieldChange={handleSectionFieldChange}
                    />

                    {/* Información Académica */}
                    <AcademicInfoSection
                        student={student}
                        editedStudent={editingSection === 'academic' ? sectionEditedData : editedStudent}
                        isEditing={editingSection === 'academic'}
                        onEdit={() => handleSectionEdit('academic', {
                            university: student?.university || '',
                            career: student?.career || '',
                            gpa: student?.gpa || 0
                        })}
                        onSave={() => handleSectionSave('academic')}
                        onCancel={() => handleSectionCancel('academic')}
                        onFieldChange={handleSectionFieldChange}
                    />

                    {/* Habilidades y Competencias */}
                    <SkillsSection
                        student={student}
                        editedStudent={editingSection === 'skills' ? sectionEditedData : editedStudent}
                        isEditing={editingSection === 'skills'}
                        onEdit={() => handleSectionEdit('skills', {
                            skills: student?.skills || []
                        })}
                        onSave={() => handleSectionSave('skills')}
                        onCancel={() => handleSectionCancel('skills')}
                        onFieldChange={handleSectionFieldChange}
                    />

                    {/* Idiomas y Niveles */}
                    <LanguagesSection
                        student={student}
                        editedStudent={editingSection === 'languages' ? sectionEditedData : editedStudent}
                        isEditing={editingSection === 'languages'}
                        onEdit={() => handleSectionEdit('languages', {
                            languages: student?.languages || []
                        })}
                        onSave={() => handleSectionSave('languages')}
                        onCancel={() => handleSectionCancel('languages')}
                        onFieldChange={handleSectionFieldChange}
                    />

                    {/* Documentos */}
                    <DocumentsSection
                        student={student}
                        onCvUpload={handleCvUpload}
                        onCvRemove={handleCvRemove}
                        cvFile={cvFile}
                        uploading={uploading}
                    />
                </div>

                {/* Sidebar */}
                <div className="space-y-6 w-full">
                    <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="font-semibold text-[#1c274d] text-sm">Perfil Completado</h3>
                            <span className="text-[#407dc3] font-bold text-sm">{profileCompletion}%</span>
                        </div>
                        <div className="w-full bg-[#d9d9d9] rounded-full h-2 mb-4">
                            <div 
                                className="bg-[#407dc3] h-2 rounded-full transition-all duration-500" 
                                style={{ width: `${profileCompletion}%` }}
                            ></div>
                        </div>
                        <div className="mt-3 space-y-2 text-xs">
                            {completionItems.map((item, index) => (
                                <p 
                                    key={index} 
                                    className={`flex items-center gap-1 ${item.completed ? 'text-[#1c274d]' : 'text-[#787878]'}`}
                                >
                                    {item.completed ? (
                                        <CheckCircle className="w-3 h-3 text-green-500" />
                                    ) : (
                                        <span className="w-3 h-3 rounded-full border border-[#787878]"></span>
                                    )}
                                    <span className={item.completed ? 'font-bold' : ''}>
                                        {item.text}
                                    </span>
                                </p>
                            ))}
                        </div>
                    </div>

                    <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-[#1c274d] text-sm mb-3 flex items-center gap-2">
                            <Globe className="w-4 h-4 text-[#407dc3]" />
                            Idiomas
                        </h3>
                        <div className="space-y-2 text-xs">
                            {student?.languages?.map((lang, index) => (
                                <div key={index} className="flex justify-between items-center">
                                    <span className="text-[#1c274d] font-medium">{lang.name}</span>
                                    <span className="text-[#787878]">{lang.level}</span>
                                </div>
                            ))}
                            {(!student?.languages || student.languages.length === 0) && (
                                <p className="text-gray-500 text-sm">No languages added</p>
                            )}
                        </div>
                    </div>

                    <div className="border border-[#d9d9d9] rounded-lg p-4 shadow-sm">
                        <h3 className="font-semibold text-[#1c274d] text-sm mb-3 flex items-center gap-2">
                            <BarChart3 className="w-4 h-4 text-[#407dc3]" />
                            Estadísticas
                        </h3>
                        <div className="space-y-2 text-xs">
                            <div className="flex justify-between items-center py-1 border-b border-dashed">
                                <span className="text-[#1c274d] font-medium">Postulaciones</span>
                                <span className="font-bold text-[#407dc3]">12</span>
                            </div>
                            <div className="flex justify-between items-center py-1 border-b border-dashed">
                                <span className="text-[#1c274d] font-medium">Entrevistas</span>
                                <span className="font-bold text-[#407dc3]">3</span>
                            </div>
                            <div className="flex justify-between items-center pt-1">
                                <span className="text-[#1c274d] font-medium">Perfil visto</span>
                                <span className="font-bold text-[#407dc3]">47 veces</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// Job Board Section 
const JobBoardSection = () => {
  const jobListings = [
    { id: 1, company: "Techinnovate Solutions", subtitle: "Tecnología • Desarrollo de Software", position: "UX/UI Designer", status: "Solicitud", statusColor: "bg-[#db1320]" },
    { id: 2, company: "GlobalNet Dynamics", subtitle: "Finanzas • Análisis de Datos", position: "Data Analyst Trainee", status: "Entrevista", statusColor: "bg-[#407dc3]" },
  ];

  const middleListings = [
    { id: 1, company: "GlobalNet Dynamics", subtitle: "Finanzas • Análisis de Datos", position: "Data Analyst Trainee", date: "Lunes, 18 Nov • 10:00 AM", type: "Online Zoom Meeting (link)", status: "Entrevista", statusColor: "bg-[#407dc3]" },
    { id: 2, company: "Innovación Creativa S.L.", subtitle: "Marketing • Redes Sociales", position: "Social Media Intern", date: "Miércoles, 20 Nov • 3:00 PM", type: "Offline at the company (Location)", status: "Pendiente", statusColor: "bg-[#787878]" },
  ];

  const contacts = [
    { id: 1, name: "Dr. Elena Navarro", role: "Directora de Recursos Humanos" },
    { id: 2, name: "Ana Paula García López", role: "Ingeniería en Sistemas" },
  ];

  return (
    <div className="pb-8 w-full max-w-full">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
        <div className="space-y-4 w-full">
          <h2 className="font-bold text-xl text-[#1c274d] mb-4">Postulaciones Recientes</h2>
          {jobListings.map((job) => (
            <div key={job.id} className="bg-white rounded-lg p-4 shadow-xl hover:shadow-2xl transition duration-300 w-full">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-[#1c274d] text-sm">{job.company}</h3>
                  <p className="text-xs text-[#787878]">{job.subtitle}</p>
                </div>
              </div>
              <p className="text-sm font-bold text-[#1c274d] mb-3">{job.position}</p>
              <Badge className={`${job.statusColor} text-white text-xs mb-2`}>{job.status}</Badge>
              <div className="flex gap-2 text-xs mt-2">
                <span className="text-[#407dc3] flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Remoto
                </span>
                <span className="text-[#787878]">Tiempo completo</span>
              </div>
            </div>
          ))}
        </div>

        <div className="space-y-4 w-full">
            <h2 className="font-bold text-xl text-[#1c274d] mb-4">Entrevistas Programadas</h2>
          {middleListings.map((job) => (
            <div key={job.id} className="bg-white rounded-lg p-4 shadow-xl w-full">
              <div className="mb-2">
                <h3 className="font-semibold text-[#1c274d] text-sm">{job.company}</h3>
                <p className="text-xs text-[#787878]">{job.subtitle}</p>
              </div>
              <p className="text-sm font-bold text-[#1c274d] mb-2">{job.position}</p>
              <p className="text-sm text-[#db1320] font-medium mb-1">{job.date}</p>
              <p className="text-xs text-[#787878] mb-3">{job.type}</p>
              <Badge className={`${job.statusColor} text-white text-xs mb-3`}>{job.status}</Badge>
              <div className="flex flex-col gap-2">
                <Button size="sm" className="bg-[#1c274d] hover:bg-[#2c375d] text-white text-xs h-8 w-full">
                  Unirse a la Entrevista
                </Button>
                <div className='flex gap-2 w-full'>
                    <Button size="sm" variant="outline" className="text-xs h-8 flex-1 bg-transparent hover:bg-[#cfe5ff] border-[#407dc3] text-[#407dc3]">
                        <Map className="w-3 h-3 mr-1" />
                        Ver en Mapa
                    </Button>
                    <Button size="sm" variant="outline" className="text-xs h-8 flex-1 bg-transparent hover:bg-[#cfe5ff] border-[#407dc3] text-[#407dc3]">
                        <Calendar className="w-3 h-3 mr-1" />
                        Añadir a Calendario
                    </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-lg p-4 shadow-xl max-h-[700px] overflow-y-auto w-full">
          <h2 className="font-semibold text-[#1c274d] mb-4 text-sm flex items-center gap-2">
            <Users className="w-4 h-4 text-[#407dc3]" />
            Contactos
          </h2>
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center gap-3 pb-3 border-b border-[#d9d9d9] last:border-b-0">
                <div className="w-10 h-10 rounded-full bg-[#407dc3] flex items-center justify-center flex-shrink-0 shadow-md">
                  <span className="text-white text-xs font-semibold">{contact.name.charAt(0)}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-[#1c274d] truncate">{contact.name}</p>
                  <p className="text-xs text-[#787878] truncate">{contact.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default function StudentProfilePage() {
    const params = useParams();
    const [student, setStudent] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [editedStudent, setEditedStudent] = useState(null);

    const getCurrentUserId = () => {
        if (typeof window !== 'undefined') {
            const userData = localStorage.getItem('user');
            if (userData) {
                try {
                    const user = JSON.parse(userData);
                    return user.id?.toString();
                } catch (error) {
                    console.error('❌ Error parsing user data:', error);
                }
            }
            
            const currentUserId = localStorage.getItem('currentUserId');
            const userEmail = localStorage.getItem('userEmail');
            
            return currentUserId || userEmail;
        }
        return null;
    };

    const currentUserId = getCurrentUserId();
    
    const isOwnProfile = currentUserId && student && (
        currentUserId.toString() === student.id?.toString() || 
        currentUserId.toString() === params.id ||
        currentUserId === student.email
    );

    useEffect(() => {
        const fetchStudentData = async (id) => {
            try {
                setIsLoading(true);
                console.log('🔄 Fetching student data for ID:', id);
                
                const response = await fetch(`/api/student_profile/${id}`);
                
                if (!response.ok) {
                    throw new Error('Student not found');
                }
                
                const studentData = await response.json();
                console.log('📥 Raw API response:', studentData);
                
                const processedData = {
                    id: studentData.id || studentData._id || params.id,
                    full_name: studentData.full_name || '',
                    email: studentData.email || '',
                    optional_email: studentData.optional_email || '',
                    phone: studentData.phone || '',
                    university: studentData.university || '',
                    career: studentData.career || '',
                    semester: parseInt(studentData.semester) || 0,
                    gpa: parseFloat(studentData.gpa) || 0,
                    student_card: studentData.student_card || '',
                    profile_image_url: studentData.profile_image_url || '',
                    skills: Array.isArray(studentData.skills) ? studentData.skills : [],
                    languages: Array.isArray(studentData.languages) ? studentData.languages : [],
                    ...studentData
                };

                console.log('✅ Processed student data:', {
                    skills: processedData.skills,
                    languages: processedData.languages
                });
                
                setStudent(processedData);
                setEditedStudent({...processedData});
            } catch (error) {
                console.error('❌ Error fetching student:', error);
                setStudent(null);
            } finally {
                setIsLoading(false);
            }
        };

        if (params.id) {
            fetchStudentData(params.id);
        }
    }, [params.id]);

    const handleSectionSave = async (section, data) => {
        try {
            console.log('🎯 SAVING SECTION:', section, data);

            const updateData = {
                ...editedStudent,
                ...data
            };

            const response = await fetch(`/api/student_profile/${params.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    ...updateData,
                    semester: parseInt(updateData.semester) || 0,
                    gpa: parseFloat(updateData.gpa) || 0,
                    skills: Array.isArray(updateData.skills) ? updateData.skills : [],
                    languages: Array.isArray(updateData.languages) ? updateData.languages : []
                }),
            });

            console.log('📡 API Response status:', response.status);
            
            if (response.ok) {
                const updatedStudent = await response.json();
                console.log('✅ API Response data:', updatedStudent);

                const processedData = {
                    id: updatedStudent.id || updatedStudent._id || params.id,
                    full_name: updatedStudent.full_name || '',
                    email: updatedStudent.email || '',
                    optional_email: updatedStudent.optional_email || '',
                    phone: updatedStudent.phone || '',
                    university: updatedStudent.university || '',
                    career: updatedStudent.career || '',
                    semester: parseInt(updatedStudent.semester) || 0,
                    gpa: parseFloat(updatedStudent.gpa) || 0,
                    student_card: updatedStudent.student_card || '',
                    profile_image_url: updatedStudent.profile_image_url || '',
                    skills: Array.isArray(updatedStudent.skills) ? updatedStudent.skills : [],
                    languages: Array.isArray(updatedStudent.languages) ? updatedStudent.languages : [],
                    ...updatedStudent
                };

                setStudent(processedData);
                setEditedStudent({...processedData});
                
                console.log('🎉 Section save completed successfully!');
                
            } else {
                const errorData = await response.json();
                console.error('❌ API Error:', errorData);
                throw new Error('Failed to update student');
            }
        } catch (error) {
            console.error('💥 Error updating student:', error);
            alert('Error al actualizar el perfil: ' + error.message);
            throw error;
        }
    };

    const handleFieldChange = (field, value) => {
        setEditedStudent(prev => ({
            ...prev,
            [field]: value
        }));
    };

    if (isLoading) {
        return (
            <ProfileLayout isOwnProfile={false}>
                <div className="flex items-center justify-center p-16 font-sans w-full">
                    <div className="flex flex-col items-center text-[#1c274d] text-xl font-semibold p-8 bg-white rounded-lg shadow-xl">
                        <div className="animate-spin h-8 w-8 text-[#407dc3] mb-3 border-4 border-[#407dc3] border-t-transparent rounded-full"></div>
                        Cargando perfil...
                    </div>
                </div>
            </ProfileLayout>
        );
    }

    if (!student) {
        return (
            <ProfileLayout isOwnProfile={false}>
                <div className="flex items-center justify-center p-16 font-sans w-full">
                    <div className="p-8 bg-white rounded-lg shadow-xl border-l-4 border-[#db1320] text-[#1c274d]">
                        <h2 className="text-xl font-bold text-[#db1320] mb-2">Error 404</h2>
                        <p className="text-gray-600">Perfil de estudiante con ID **{params.id}** no encontrado.</p>
                    </div>
                </div>
            </ProfileLayout>
        );
    }
    
    return (
        <ProfileLayout isOwnProfile={isOwnProfile}>
            <div className="w-full max-w-full space-y-8">
                <UserProfileSection 
                    student={student}
                    onSectionSave={handleSectionSave}
                    editedStudent={editedStudent}
                    onFieldChange={handleFieldChange}
                />
                <JobBoardSection />
            </div>
        </ProfileLayout>
    );
}
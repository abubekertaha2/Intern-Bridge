"use client";
import { useRef, useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [fileName, setFileName] = useState("Subir carnet estudiantil (JPG, PNG, PDF)");
  const [loading, setLoading] = useState(false);
  const [studentIdFile, setStudentIdFile] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    optionalEmail: "",
    phone: "",
    university: "",
    career: "",
    semester: "",
    gpa: "",
    password: "",
    confirmPassword: "",
  });

  const [errors, setErrors] = useState({});

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) {
      setFileName(f.name);
      setStudentIdFile(f);
    }
    else {
      setFileName("Subir carnet estudiantil (JPG, PNG, PDF)");
      setStudentIdFile(null);
    }
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^[\+]?[1-9][\d]{0,15}$/.test(phone.replace(/[\s\-\(\)]/g, ""));

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = "Este campo es obligatorio";
    if (!formData.email.trim()) newErrors.email = "Este campo es obligatorio";
    else if (!validateEmail(formData.email)) newErrors.email = "Por favor ingresa un email válido";
    if (formData.optionalEmail && !validateEmail(formData.optionalEmail))
      newErrors.optionalEmail = "Por favor ingresa un email válido";
    if (!formData.phone.trim()) newErrors.phone = "Este campo es obligatorio";
    else if (!validatePhone(formData.phone))
      newErrors.phone = "Por favor ingresa un número de teléfono válido";
    if (!formData.university.trim()) newErrors.university = "Este campo es obligatorio";
    if (!formData.career.trim()) newErrors.career = "Este campo es obligatorio";
    if (!formData.semester.trim()) newErrors.semester = "Este campo es obligatorio";
    if (formData.gpa) {
      const g = parseFloat(formData.gpa);
      if (isNaN(g) || g < 0 || g > 4) newErrors.gpa = "El promedio debe estar entre 0 y 4";
    }
    if (!formData.password.trim()) newErrors.password = "Este campo es obligatorio";
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Este campo es obligatorio";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    setLoading(true);

    const data = new FormData();

    Object.keys(formData).forEach(key => {
        if (key !== 'confirmPassword') {
            data.append(key, formData[key]);
        }
    });
    
    if (studentIdFile) {
        data.append('studentIdCard', studentIdFile); 
    }

    try {
        const response = await fetch('/api/register_student', {
            method: 'POST',
            body: data, 
        });

        const result = await response.json();

        if (response.ok) {
    
          console.log(result.message);
          
          if (result.id) {
              
              router.push(`/student/profile/${result.id}`);
          } else {
              
              router.push('/student/dashboard');
          }
          
      } else {
          alert(`Error de registro: ${result.message}`);
      }
    } catch (error) {
        console.error("Fetch Error:", error);
        alert("Error de conexión con el servidor. Intenta de nuevo.");
    } finally {
        setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full max-w-lg">
        <h2 className="text-4xl font-extrabold text-center mb-2">Registro de Estudiante</h2>
        <p className="text-center text-blue-500 mb-6">Crea tu perfil estudiantil</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-semibold mb-1">
              Nombre completo <span className="text-red-600">*</span>
            </label>
            <input
              name="fullName"
              placeholder="Cameron Williamson"
              value={formData.fullName}
              onChange={handleChange}
              className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                errors.fullName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Correo Electrónico <span className="text-red-600">*</span>
            </label>
            <input
              name="email"
              type="email"
              placeholder="email@compulaboratoriosmendez.com"
              value={formData.email}
              onChange={handleChange}
              className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                errors.email ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Correo Electrónico (Opcional)
            </label>
            <input
              name="optionalEmail"
              type="email"
              placeholder="email@opcional.com"
              value={formData.optionalEmail}
              onChange={handleChange}
              className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                errors.optionalEmail ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.optionalEmail && (
              <p className="text-red-500 text-sm mt-1">{errors.optionalEmail}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Teléfono <span className="text-red-600">*</span>
            </label>
            <input
              name="phone"
              type="tel"
              placeholder="(406) 555-0120"
              value={formData.phone}
              onChange={handleChange}
              className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                errors.phone ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone}</p>}
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">
              Universidad <span className="text-red-600">*</span>
            </label>
            <input
              name="university"
              placeholder="Universidad"
              value={formData.university}
              onChange={handleChange}
              className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                errors.university ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.university && (
              <p className="text-red-500 text-sm mt-1">{errors.university}</p>
            )}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Carrera <span className="text-red-600">*</span>
              </label>
              <input
                name="career"
                placeholder="Carrera"
                value={formData.career}
                onChange={handleChange}
                className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                  errors.career ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.career && <p className="text-red-500 text-sm mt-1">{errors.career}</p>}
            </div>

            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Semestre <span className="text-red-600">*</span>
              </label>
              <input
                name="semester"
                placeholder="Nro de semestre"
                value={formData.semester}
                onChange={handleChange}
                className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                  errors.semester ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.semester && <p className="text-red-500 text-sm mt-1">{errors.semester}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Carnet Estudiantil (Opcional)</label>
            <div
              onClick={handleFileClick}
              className="cursor-pointer border-2 border-dashed rounded-lg p-3 bg-blue-50 hover:bg-blue-100 flex items-center justify-between"
            >
              <span className="text-sm">{fileName}</span>
              <button type="button" className="text-sm underline">Seleccionar</button>
              <input
                ref={fileInputRef}
                onChange={handleFileChange}
                accept=".jpg,.jpeg,.png,.pdf"
                type="file"
                className="hidden"
                name="studentIdCard"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold mb-1">Promedio (Opcional)</label>
            <input
              name="gpa"
              type="number"
              step="0.01"
              min="0"
              max="4"
              placeholder="3.75"
              value={formData.gpa}
              onChange={handleChange}
              className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                errors.gpa ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.gpa && <p className="text-red-500 text-sm mt-1">{errors.gpa}</p>}
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Contraseña <span className="text-red-600">*</span>
              </label>
              <input
                name="password"
                type="password"
                placeholder="**********"
                value={formData.password}
                onChange={handleChange}
                className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
            </div>
            <div className="flex-1">
              <label className="block text-sm font-semibold mb-1">
                Confirmar Contraseña <span className="text-red-600">*</span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                placeholder="**********"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={`profile-input w-full p-3 border rounded-lg focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1C274D] text-white font-bold p-3 rounded-lg hover:bg-[#2A3A5F] disabled:opacity-60"
            >
              {loading ? "Registrando..." : "Regístrate"}
            </button>

            <div className="mt-3 text-center">
              <button
                type="button"
                onClick={() => {
                  if (confirm("¿Estás seguro de que quieres volver? Se perderán los datos ingresados.")) {
                    router.back();
                  }
                }}
                className="text-red-600 hover:underline font-semibold"
              >
                Volver
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .profile-input::placeholder {
          color: #1C274D80;
        }
      `}</style>
    </AuthLayout>
  );
}
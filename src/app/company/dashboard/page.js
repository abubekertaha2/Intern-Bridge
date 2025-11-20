"use client";
import { useRef, useState } from "react";
import AuthLayout from "@/components/layout/AuthLayout";
import { useRouter } from "next/navigation";

export default function CompanyDashboardPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [formData, setFormData] = useState({
    companyName: "",
    industry: "",
    companySize: "",
    description: "",
    website: "",
    contactName: "",
    contactPosition: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [fileName, setFileName] = useState("Subir logo de la empresa (JPG, PNG, PDF)");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleFileClick = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const f = e.target.files?.[0];
    if (f) setFileName(f.name);
    else setFileName("Subir logo de la empresa (JPG, PNG, PDF)");
  };

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\(\d{3}\) \d{3}-\d{4}$/.test(phone);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.companyName.trim()) newErrors.companyName = "Este campo es obligatorio";
    if (!formData.industry.trim()) newErrors.industry = "Este campo es obligatorio";
    if (!formData.companySize.trim()) newErrors.companySize = "Este campo es obligatorio";
    if (!formData.description.trim()) newErrors.description = "Este campo es obligatorio";
    if (!formData.contactName.trim()) newErrors.contactName = "Este campo es obligatorio";
    if (!formData.contactPosition.trim()) newErrors.contactPosition = "Este campo es obligatorio";
    if (!formData.email.trim()) newErrors.email = "Este campo es obligatorio";
    else if (!validateEmail(formData.email)) newErrors.email = "Por favor ingresa un email válido";
    if (!formData.phone.trim()) newErrors.phone = "Este campo es obligatorio";
    else if (!validatePhone(formData.phone)) newErrors.phone = "Por favor ingresa un número de teléfono válido";
    if (!formData.password.trim()) newErrors.password = "Este campo es obligatorio";
    if (!formData.confirmPassword.trim()) newErrors.confirmPassword = "Este campo es obligatorio";
    if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Las contraseñas no coinciden";
    if (!fileName || fileName === "Subir logo de la empresa (JPG, PNG, PDF)")
      newErrors.logo = "El logo es obligatorio";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setErrors({});

    try {
      // Construct FormData to send
      const formDataToSend = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        formDataToSend.append(key, value);
      });

      // Append logo file
      if (fileInputRef.current?.files[0]) {
        formDataToSend.append("companyLogo", fileInputRef.current.files[0]);
      }

      // Send to backend API
      const res = await fetch("/api/register_company", {
        method: "POST",
        body: formDataToSend,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Error al registrar la empresa");
      }

      alert("¡Registro exitoso! Tu empresa ha sido registrada.");
      router.push(`/company/profile/${data.id}`);

      // Reset form after success
      setFormData({
        companyName: "",
        industry: "",
        companySize: "",
        description: "",
        website: "",
        contactName: "",
        contactPosition: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
      });
      setFileName("Subir logo de la empresa (JPG, PNG, PDF)");
    } catch (error) {
      console.error("Error:", error);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout>
      <div className="flex flex-col gap-6 w-full max-w-6xl mx-auto px-2">
        <h2 className="text-4xl font-extrabold text-center text-[#1C274D]">
          Registro de Empresa
        </h2>
        <p className="text-center text-blue-200">Crea tu perfil empresarial</p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
          {/* Nombre de la Empresa */}
          <div>
            <label className="block font-semibold mb-1 text-[#1C274D]">
              Nombre de la Empresa <span className="text-red-600">*</span>
            </label>
            <input
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              placeholder="Nombre de la Empresa"
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                errors.companyName ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.companyName && (
              <p className="text-red-500 text-sm">{errors.companyName}</p>
            )}
          </div>

          {/* Industry & Company Size */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Industria <span className="text-red-600">*</span>
              </label>
              <select
                name="industry"
                value={formData.industry}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.industry ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar industria</option>
                <option value="tecnologia">Tecnología</option>
                <option value="salud">Salud</option>
                <option value="educacion">Educación</option>
                <option value="finanzas">Finanzas</option>
                <option value="retail">Retail</option>
              </select>
              {errors.industry && (
                <p className="text-red-500 text-sm">{errors.industry}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Tamaño de la Empresa <span className="text-red-600">*</span>
              </label>
              <select
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.companySize ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar tamaño</option>
                <option value="1-10">1-10 empleados</option>
                <option value="11-50">11-50 empleados</option>
                <option value="51-200">51-200 empleados</option>
                <option value="201-500">201-500 empleados</option>
                <option value="500+">500+ empleados</option>
              </select>
              {errors.companySize && (
                <p className="text-red-500 text-sm">{errors.companySize}</p>
              )}
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block font-semibold mb-1 text-[#1C274D]">
              Descripción de la Empresa <span className="text-red-600">*</span>
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Descripción breve"
              rows={4}
              className={`w-full p-3 border rounded-lg focus:outline-none ${
                errors.description ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.description && (
              <p className="text-red-500 text-sm">{errors.description}</p>
            )}
          </div>

          {/* Website */}
          <div>
            <label className="block font-semibold mb-1 text-[#1C274D]">
              Sitio Web (Opcional)
            </label>
            <input
              name="website"
              value={formData.website}
              onChange={handleChange}
              type="url"
              placeholder="https://www.ejemplo.com/"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none"
            />
          </div>

          {/* Contact Name & Position */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Nombre del Contacto <span className="text-red-600">*</span>
              </label>
              <input
                name="contactName"
                value={formData.contactName}
                onChange={handleChange}
                placeholder="Nombre"
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.contactName ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contactName && (
                <p className="text-red-500 text-sm">{errors.contactName}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Cargo <span className="text-red-600">*</span>
              </label>
              <input
                name="contactPosition"
                value={formData.contactPosition}
                onChange={handleChange}
                placeholder="Cargo"
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.contactPosition ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.contactPosition && (
                <p className="text-red-500 text-sm">{errors.contactPosition}</p>
              )}
            </div>
          </div>

          {/* Email & Phone */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Correo Corporativo <span className="text-red-600">*</span>
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                type="email"
                placeholder="email@empresa.com"
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Teléfono <span className="text-red-600">*</span>
              </label>
              <input
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                type="tel"
                placeholder="(406) 555-0120"
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm">{errors.phone}</p>
              )}
            </div>
          </div>

          {/* Logo Upload */}
          <div>
            <label className="block font-semibold mb-1 text-[#1C274D]">
              Logo de la Empresa <span className="text-red-600">*</span>
            </label>
            <div
              onClick={handleFileClick}
              className={`w-full p-3 border-2 border-dashed rounded-lg cursor-pointer flex items-center justify-center ${
                errors.logo ? "border-red-500 bg-red-50" : "border-gray-300 bg-[#CFE5FF]"
              }`}
            >
              {fileName}
            </div>
            <input
              type="file"
              name="companyLogo"
              ref={fileInputRef}
              className="hidden"
              accept="image/jpeg,image/png,application/pdf"
              onChange={handleFileChange}
            />
            {errors.logo && <p className="text-red-500 text-sm">{errors.logo}</p>}
          </div>

          {/* Password & Confirm Password */}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Contraseña <span className="text-red-600">*</span>
              </label>
              <input
                name="password"
                type="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="**********"
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.password ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.password && (
                <p className="text-red-500 text-sm">{errors.password}</p>
              )}
            </div>

            <div className="flex-1">
              <label className="block font-semibold mb-1 text-[#1C274D]">
                Confirmar Contraseña <span className="text-red-600">*</span>
              </label>
              <input
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="**********"
                className={`w-full p-3 border rounded-lg focus:outline-none ${
                  errors.confirmPassword ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-sm">{errors.confirmPassword}</p>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-3 mt-2">
            <button
              type="submit"
              className="w-full p-3 bg-[#1C274D] text-white rounded-lg font-bold hover:bg-[#2A3A5F] transition"
              disabled={loading}
            >
              {loading ? "Registrando..." : "Regístrate"}
            </button>
            <button
              type="button"
              className="w-full p-3 border border-red-600 text-red-600 rounded-lg hover:bg-red-50 transition"
              onClick={() => router.back()}
            >
              Volver
            </button>
          </div>
        </form>
      </div>
    </AuthLayout>
  );
}

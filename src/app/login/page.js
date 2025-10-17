
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout.js';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams(); 

  // --- LOGIC TO READ URL PARAMETER ---
  const initialSelection = searchParams.get('type');
  let defaultType = 'student';
  
  if (initialSelection === 'empresa') {
    defaultType = 'employer';
  }
  
  // State holds the selected user type (student or employer)
  const [userType, setUserType] = useState(defaultType); 
  // Helper label to display the user type in Spanish
  const userTypeLabel = userType === 'student' ? 'Estudiante' : 'Compañía/Universidad';
  // --- END LOGIC ---

  // Handle the login process
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Pass the selected role in the payload
      const response = await axios.post('/api/login', {
        email,
        password,
        // userType holds the value determined by the selection on the previous page
        role: userType, 
      });

      const { role } = response.data;

      // Role-Based Redirection
      if (role === 'student') {
        router.push('/student/dashboard');
      
      } else if (role === 'company' || role === 'university') {
        router.push('/company/dashboard');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Credenciales inválidas. Por favor, intente de nuevo.';
      setError(errorMessage);
    }
  };

  return (
    <AuthLayout>
      <div className="w-full">
        {/* Header */}
        <div className="text-center mb-8"> 
          <h3 className="text-[var(--color-primary-blue)] text-3xl font-bold mb-1 md:text-3xl">
            Iniciar Sesión
          </h3>
          <p className="text-[var(--color-blue-light)] font-normal text-sm">
            Accede a tu cuenta existente
          </p>
        </div>

        {error && (
          <div className="mb-6 py-3 px-4 bg-[rgba(194,27,27,0.1)] border border-[var(--color-accent-red)] text-[var(--color-accent-red)] rounded-lg text-center font-medium">
            {error}
          </div>
        )}

        {/* Dynamic User Type Header (Replaces the toggle buttons) */}
        <div className="text-center mb-6 w-full"> 
          <div className="bg-[var(--color-primary-blue)] rounded-xl shadow-lg w-full px-6 py-3">
            {/* Displaying only the selected user type label now */}
            <span className="text-white text-lg font-bold">{userTypeLabel}</span>
          </div>
        </div>
        {/* End Dynamic User Type Header */}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email Field */}
          <div className="space-y-1"> 
            <label htmlFor="email" className="text-[var(--color-gray-dark)] px-2 text-base font-bold">Correo Electrónico</label>
            
            <div className="border-2 border-[var(--color-primary-blue)] rounded-xl px-4 py-3 shadow-sm">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@compulaboratoriosmendez.com"
                className="w-full text-[var(--color-blue-placeholder)] font-normal outline-none text-base"
                required
              />
            </div>
          </div>

          {/* Password Field */}
          <div className="space-y-1"> 
            <label htmlFor="password" className="text-[var(--color-gray-dark)] px-2 text-base font-bold">Contraseña</label>
            
            <div className="border-2 border-[var(--color-primary-blue)] rounded-xl px-4 py-3 shadow-sm">
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="**********"
                className="w-full text-[var(--color-blue-placeholder)] font-normal outline-none text-base"
                required
              />
            </div>
          </div>

          {/* Login Button */}
          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-[var(--color-primary-blue)] text-white text-lg font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all duration-200 shadow-xl"
            >
              Iniciar Sesión
            </button>
          </div>
        </form>

        {/* Additional Options */}
        <div className="flex flex-col sm:flex-row justify-center items-center space-y-3 sm:space-y-0 sm:space-x-4 py-1">
          <button onClick={() => router.push('/')} className="text-[var(--color-accent-red)] text-base font-bold hover:underline">
            Volver
          </button>
          <div className="hidden sm:block w-px h-6 bg-[var(--color-accent-red)]"></div>
          <button className="text-[var(--color-accent-red)] text-base font-bold hover:underline">
            Olvide mi contraseña
          </button>
        </div>
        <div className="text-center my-1">
          <span className="text-[var(--color-accent-red)] text-lg font-bold">o</span>
        </div>

        {/* Google Sign In */}
        <button className="w-full border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] text-lg font-bold py-3 rounded-xl flex items-center justify-center space-x-2 hover:bg-gray-50 transition-all duration-200 shadow-md">
          <Image
            src="/assets/google.svg" 
            alt="Google"
            width={24}
            height={24}
            priority
          />
          <span>Continuar con Google</span>
        </button>

        {/* Sign Up Link */}
        <div className="text-center mt-3">
          <span className="text-[var(--color-accent-red)] text-lg font-bold">¿Nuevo aquí?</span>
          <button className="w-full border-2 border-[var(--color-primary-blue)] text-[var(--color-primary-blue)] text-lg font-bold py-3 rounded-xl mt-3 hover:bg-gray-50 transition-all duration-200 shadow-md">
            Regístrate
          </button>
        </div>
      </div>
    </AuthLayout>
  );
}

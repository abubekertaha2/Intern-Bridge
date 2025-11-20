'use client';

import { useState, useEffect } from 'react';
import {Eye , EyeOff} from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';
import AuthLayout from '@/components/layout/AuthLayout.js';
import axios from 'axios';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword , setShowPassword] = useState(false)
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialSelection = searchParams.get('type');
  const [userType, setUserType] = useState(() => {
    if (initialSelection === 'company') return 'company';
    if (initialSelection === 'student') return 'student';
    if (typeof window !== 'undefined') {
      return localStorage.getItem('role') || 'student';
    }
    return 'student';
  });

  useEffect(() => {
    if (initialSelection) setUserType(initialSelection);
  }, [initialSelection]);

  useEffect(() => {
    if (typeof window !== 'undefined') localStorage.setItem('role', userType);
  }, [userType]);

  const userTypeLabel = userType === 'student' ? 'Estudiante' : 'Compañía';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await axios.post('/api/login', {
        email,
        password,
        role: userType,
      });

      const { exists, role, id } = response.data;

      if (!exists) {
        setError('No estás registrado. Por favor regístrate.');
        return;
      }
      if (typeof window !== 'undefined') {
        const userData = {
          id: id,
          email: email,
          role: role,
          isLoggedIn: true,
          loginTime: new Date().toISOString()
        };
        
        console.log('🔄 Storing user data in localStorage:', userData);
        localStorage.setItem('user', JSON.stringify(userData));
        
        // store individual fields for easy access
        localStorage.setItem('currentUserId', id);
        localStorage.setItem('userEmail', email);
        localStorage.setItem('userRole', role);
        
        // Verify it was stored correctly
        const storedUser = localStorage.getItem('user');
        console.log('✅ Verified stored user:', JSON.parse(storedUser));
      }

      // Redirect to profile page dynamically
      if (role === 'student') {
        router.push(`/student/profile/${id}`);
      } else {
        router.push(`/company/profile/${id}`);
      }
    } catch (err) {
      const errorMessage =
        err.response?.data?.message ||
        'Error al iniciar sesión. Por favor, inténtelo de nuevo.';
      setError(errorMessage);
    }
  };
  
  const handleGoogleLogin = () => {
      console.log("Initiating Google Sign-In flow...");
      
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

        {/* Role Display */}
        <div className="text-center mb-6 w-full">
          <div className="bg-[var(--color-primary-blue)] rounded-xl shadow-lg w-full px-6 py-3">
            <span className="text-white text-lg font-bold">{userTypeLabel}</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="space-y-1">
            <label htmlFor="email" className="text-[var(--color-gray-dark)] px-2 text-base font-bold">
              Correo Electrónico
            </label>
            <div className="border-2 border-[var(--color-primary-blue)] rounded-xl px-4 py-3 shadow-sm">
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@charles.com"
                className="w-full text-[var(--color-blue-placeholder)] font-normal outline-none text-base"
                required
              />
            </div>
          </div>

          <div className="space-y-1">
            <label htmlFor="password" className="text-[var(--color-gray-dark)] px-2 text-base font-bold">
              Contraseña
            </label>
            <div className="border-2 border-[var(--color-primary-blue)] rounded-xl px-4 py-3 shadow-sm flex items-center">
              <input
                id="password"
                type= {showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="**********"
                autoComplete='new-password'
                className="w-full text-[var(--color-blue-placeholder)] font-normal outline-none text-base"
                required
              />
              <button
                type='button'
                onClick={() => setShowPassword(!showPassword)}
                className='ml-2 text-gray-500'
              >
                {showPassword ? <Eye size={20}/> : <EyeOff size={20}/>}
              </button>
            </div>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              className="w-full bg-[var(--color-primary-blue)] cursor-pointer text-white text-lg font-bold py-3 rounded-xl hover:bg-opacity-90 transition-all duration-200 shadow-xl"
            >
              Iniciar Sesión
            </button>
          </div>
          
          <div className="flex items-center justify-center text-sm">
                <a href="#" className="font-medium text-red-600 hover:text-red-500">
                  Volver
                </a>
                <span className="mx-2 text-gray-400">|</span>
                <a href="#" className="font-medium text-red-600 hover:text-red-500">
                  Olvidé mi contraseña
                </a>
            </div>
            
            <div className="flex items-center justify-center mt-6">
                <hr className="w-1/3 border-t border-gray-300" />
                <span className="mx-2 text-sm text-gray-500">o</span>
                <hr className="w-1/3 border-t border-gray-300" />
            </div>


            <div>
              <button
                type="button"
                onClick={handleGoogleLogin} 
                className="w-full flex justify-center items-center py-3 px-4 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <span className="mr-2">
                    <svg aria-hidden="true" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M22.56 12.25c0-.78-.07-1.54-.2-2.28H12v4.26h6.43c-.28 1.48-1.16 2.76-2.45 3.59v3.15h4.07c2.37-2.19 3.75-5.48 3.75-9.22z" fill="#4285F4"/>
                        <path d="M12 23c3.31 0 6.44-1.08 8.87-3.04l-4.07-3.15c-1.1 2.37-3.37 3.99-5.26 3.99-4.13 0-7.65-2.78-8.91-6.57H.94v3.23C3.5 20.25 7.55 23 12 23z" fill="#34A853"/>
                        <path d="M3.09 14.15c-.24-.72-.37-1.48-.37-2.15s.13-1.43.37-2.15V6.62H.94A11.97 11.97 0 000 12c0 1.9.43 3.66 1.15 5.16l2.15-2.91z" fill="#FBBC05"/>
                        <path d="M12 5.09c1.9 0 3.65.65 5.02 1.96l3.5-3.5C18.44 1.25 15.31 0 12 0 7.55 0 3.5 2.75.94 6.62l2.15 2.91c1.26-3.79 4.78-6.57 8.91-6.57z" fill="#EA4335"/>
                    </svg>
                </span>
                continuar con google
              </button>
            </div>
            
            {/* Register Link */}
            
          <div className="mt-8 text-center">
            <p className="text-xs text-gray-500 mb-2">¿Nuevo aquí?</p>
            <a 
              href={userType === 'student' ? "/student/dashboard" : "/company/dashboard"} 
              className="w-full flex justify-center py-3 px-4 border-2 border-[var(--color-primary-blue)] text-sm font-medium rounded-xl text-[var(--color-primary-blue)] hover:bg-[var(--color-primary-blue)] hover:text-white transition-all duration-200 focus:outline-none"
            >
              Regístrate
            </a>
          </div>
           
        </form>
      </div>
    </AuthLayout>
  );
}

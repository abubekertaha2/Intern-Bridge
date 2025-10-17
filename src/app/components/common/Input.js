import React from 'react';

export default function Input({ label, type = 'text', id, name, placeholder, className = '', ...rest }) {
  const inputId = id || name; 

  return (
    <div className="mb-4">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-semibold text-brand-dark mb-1">
          {label}
        </label>
      )}
      <input
        type={type}
        id={inputId}
        name={name}
        placeholder={placeholder}
        className={`w-full p-3 border border-gray-300 rounded-md shadow-sm focus:ring-brand-blue focus:border-brand-blue outline-none transition duration-150 ease-in-out ${className}`}
        {...rest}
      />
    </div>
  );
}

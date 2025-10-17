import React from 'react';

export default function Button({ children, variant = 'primary', className = '', ...rest }) {
  const baseStyle = 'w-full py-3 rounded-md font-bold text-center transition duration-200 ease-in-out cursor-pointer';

  const variantStyles = {
    primary: 'bg-brand-red text-white hover:bg-red-700 shadow-md', 
    secondary: 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-100 shadow-sm', 
    transparent: 'bg-transparent text-brand-blue border border-brand-blue hover:bg-blue-50',
  };

  return (
    <button 
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
      {...rest}
    >
      {children}
    </button>
  );
}

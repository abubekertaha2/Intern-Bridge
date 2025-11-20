import React from 'react';
import Image from 'next/image';

export default function Logo() {
  return (
    <div className="flex flex-col items-center">
      <div className="w-full max-w-[300px] h-auto rounded-lg flex items-center justify-center overflow-hidden mb-4">
        <Image
          src="/assets/logo.png"
          alt="PasantesRD Logo"
          width={200} 
          height={200}
          className="w-full h-full object-contain rounded-lg transition-transform duration-300 hover:scale-105"
        />
        
      </div>
      <div className='text-center'>
        <span className="text-xl font-bold text-white">PasantesRD</span>
        <p className='text-gray-400 whitespace-nowrap'>Conectando talento con oportunidades</p>
      </div>
    </div>
  );
}

// src/components/features/directories/CompanyCard.js
import React from 'react';
import Card from '@/app/components/common/Card';
import Button from '@/components/common/Button';
import Link from 'next/link';

export default function CompanyCard({ company }) {
  return (
    <Card className="flex items-center justify-between mb-4 border-l-4 border-brand-blue hover:shadow-lg transition">
      <div className="flex items-center space-x-4">
        {/* Placeholder Logo */}
        <div className="w-12 h-12 bg-brand-red rounded-full flex items-center justify-center text-white text-xl font-bold">
          {company.name[0]}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-brand-dark">{company.name}</h3>
          <p className="text-sm text-gray-500">{company.sector || 'N/A'}</p>
        </div>
      </div>
      <Link href={`/company/profile?id=${company.id}`} passHref>
        <Button variant="transparent" className="w-auto px-4 py-2 text-sm">
          Ver Perfil
        </Button>
      </Link>
    </Card>
  );
}
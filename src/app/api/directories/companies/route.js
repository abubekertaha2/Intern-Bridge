// src/app/api/directories/companies/route.js
import { NextResponse } from 'next/server';

// --- HARDCODED DATA (Our simulated database table) ---
const HARDCODED_COMPANIES = [
    { id: 1, name: 'Instituto Tecnológico de Santo Domingo (INTEC)', sector: 'Educación', description: 'INTEC is a leading university...' },
    { id: 2, name: 'Banco del Futuro', sector: 'Finanzas', description: 'A major bank focusing on digital transformation.' },
    { id: 3, name: 'Empresa Innovadora S.R.L.', sector: 'Tecnología', description: 'Startup specializing in AI solutions.' },
];

// Handles GET requests for the company directory list
export async function GET() {
    return NextResponse.json({ 
        companies: HARDCODED_COMPANIES 
    }, { status: 200 });
}
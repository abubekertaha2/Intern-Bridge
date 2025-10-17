import { NextResponse } from 'next/server';

// --- HARDCODED DUMMY USERS (REPLACES DATABASE) ---
const DUMMY_USERS = [
    { email: 'usuariodeprueba@mail.com', password: 'test1234', role: 'student', name: 'Usuario de Prueba' },
    { email: 'intec@mail.com', password: 'intec1234', role: 'university', name: 'INTEC' },
];

export async function POST(request) {
    const { email, password } = await request.json();

    if (!email || !password) {
        return NextResponse.json({ message: 'Email y contraseña son requeridos.' }, { status: 400 });
    }

    const user = DUMMY_USERS.find(
        u => u.email === email && u.password === password
    );

    if (!user) {
        return NextResponse.json({ message: 'Credenciales inválidas. Por favor, intente de nuevo.' }, { status: 401 });
    }

    return NextResponse.json({
        name: user.name,
        role: user.role, 
    });
}
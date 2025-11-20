import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import db from '@/lib/db';

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || !password || !role) {
      return NextResponse.json(
        { message: 'Email, contraseña y rol son requeridos.' },
        { status: 400 }
      );
    }

    const table = role === 'student' ? 'students' : 'companies';

    const [rows] = await db.query(
      `SELECT * FROM ${table} WHERE email = ?`,
      [email]
    );

    if (rows.length === 0) {
      return NextResponse.json({ exists: false }, { status: 200 });
    }

    const user = rows[0];

    // Compare hashed password
    const passwordMatch = bcrypt.compareSync(password, user.password_hash);

    if (!passwordMatch) {
      return NextResponse.json(
        { message: 'Contraseña incorrecta.' },
        { status: 401 }
      );
    }

    // Return success with role and user id
    return NextResponse.json({
      exists: true,
      role,
      id: user.id,
    });
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { message: 'Error interno del servidor.' },
      { status: 500 }
    );
  }
}

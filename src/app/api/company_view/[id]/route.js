import { NextResponse } from 'next/server';
import pool from '@/lib/db'; 

export async function GET(request, { params }) {
  try {
    const { id } = await params;

    // Fetch student data from database
    const [students] = await pool.execute(
      `SELECT 
        s.id,
        s.full_name,
        s.email,
        s.optional_email,
        s.phone,
        s.university,
        s.career,
        s.semester,
        s.gpa,
        s.student_card,
        s.profile_image_url,
        s.skills,
        s.languages,
        s.created_at
       FROM students s
       WHERE s.id = ?`,
      [id]
    );

    if (students.length === 0) {
      return NextResponse.json(
        { error: 'Estudiante no encontrado' },
        { status: 404 }
      );
    }

    const student = students[0];

    // Safe parsing function for JSON fields
    const safeJsonParse = (str) => {
      if (!str) return [];
      try {
        const parsed = JSON.parse(str);
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        // If it's a comma-separated string, split it
        if (typeof str === 'string') {
          return str.split(',').map(item => item.trim()).filter(item => item);
        }
        return [];
      }
    };

    // Format the student data
    const studentData = {
      id: student.id,
      full_name: student.full_name,
      email: student.email,
      optional_email: student.optional_email,
      phone: student.phone,
      university: student.university,
      career: student.career,
      semester: student.semester,
      gpa: student.gpa,
      student_card: student.student_card,
      profile_image_url: student.profile_image_url,
      skills: safeJsonParse(student.skills),
      languages: safeJsonParse(student.languages),
      created_at: student.created_at
    };

    return NextResponse.json(studentData);
  } catch (error) {
    console.error('Error fetching student for company view:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}
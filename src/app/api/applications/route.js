import { NextResponse } from 'next/server';
import pool from '../../lib/db';

// Safe parsing function for skills and languages
const parseField = (field) => {
  if (!field) return [];
  
  // If it's already an array, return it
  if (Array.isArray(field)) return field;
  
  // If it's a string, try to parse it
  if (typeof field === 'string') {
    try {
      // Try to parse as JSON first
      const parsed = JSON.parse(field);
      return Array.isArray(parsed) ? parsed : [parsed];
    } catch {
      // If JSON parsing fails, treat it as comma-separated string
      return field.split(',').map(item => item.trim()).filter(item => item);
    }
  }
  
  return [];
};

// GET - Check application status or get applications
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    const internship_id = searchParams.get('internship_id');
    const company_id = searchParams.get('company_id');

    // Check if student already applied to specific internship
    if (student_id && internship_id) {
      const [applications] = await pool.execute(
        'SELECT id, status, applied_at FROM applications WHERE student_id = ? AND internship_id = ?',
        [student_id, internship_id]
      );
      
      return NextResponse.json({ 
        applied: applications.length > 0,
        application: applications[0] || null
      });
    }

    // Get all applications for a student
    if (student_id) {
      const [applications] = await pool.execute(`
        SELECT 
          a.*,
          i.title as internship_title,
          i.company_id,
          c.name as company_name,
          c.logo_url as company_logo
        FROM applications a
        JOIN internships i ON a.internship_id = i.id
        JOIN companies c ON i.company_id = c.id
        WHERE a.student_id = ?
        ORDER BY a.applied_at DESC
      `, [student_id]);
      
      return NextResponse.json({ applications });
    }

    // Get applications for a company
    if (company_id) {
      const [applications] = await pool.execute(`
        SELECT 
          a.*,
          i.title as internship_title,
          s.full_name as student_name,
          s.email as student_email,
          s.university,
          s.career,
          s.semester,
          s.gpa,
          s.skills,
          s.languages,
          s.profile_image_url
        FROM applications a
        JOIN internships i ON a.internship_id = i.id
        JOIN students s ON a.student_id = s.id
        WHERE i.company_id = ?
        ORDER BY a.applied_at DESC
      `, [company_id]);
      
      // Parse skills and languages safely for company view
      const parsedApplications = applications.map(app => ({
        ...app,
        skills: parseField(app.skills),
        languages: parseField(app.languages)
      }));
      
      return NextResponse.json({ applications: parsedApplications });
    }

    return NextResponse.json({ error: 'Missing parameters' }, { status: 400 });

  } catch (error) {
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// POST - Create new application
export async function POST(request) {
  try {
    // Read the body ONLY ONCE
    const body = await request.json()
    
    const { student_id, internship_id } = body;
    
    // Validate required fields
    if (!student_id || !internship_id) {
      console.log('❌ Missing IDs:', { student_id, internship_id });
      return NextResponse.json(
        { error: 'Student ID and Internship ID are required' }, 
        { status: 400 }
      );
    }
    
    // Check if student exists
    const [students] = await pool.execute(
      'SELECT id, full_name FROM students WHERE id = ?',
      [student_id]
    );
    
    if (students.length === 0) {
      return NextResponse.json({ error: 'Estudiante no encontrado' }, { status: 404 });
    }
    
    const [internships] = await pool.execute(
      'SELECT id, company_id, title FROM internships WHERE id = ?',
      [internship_id]
    );
    
    if (internships.length === 0) {
      return NextResponse.json({ error: 'Pasantía no encontrada' }, { status: 404 });
    }
    
    const internship = internships[0];
    
    // Check if student already applied
    const [existingApplications] = await pool.execute(
      'SELECT id FROM applications WHERE student_id = ? AND internship_id = ?',
      [student_id, internship_id]
    );
    
    if (existingApplications.length > 0) {
      return NextResponse.json({ 
        error: 'Ya has aplicado a esta pasantía' 
      }, { status: 400 });
    }
    
    // Check if student owns this internship 
    const [companies] = await pool.execute(
      'SELECT id FROM companies WHERE id = ? AND id IN (SELECT company_id FROM internships WHERE id = ?)',
      [student_id, internship_id]
    );
    
    if (companies.length > 0) {
      return NextResponse.json({ 
        error: 'No puedes aplicar a tu propia pasantía' 
      }, { status: 400 });
    }
    
    // Create application
    const [result] = await pool.execute(
      'INSERT INTO applications (student_id, internship_id, status) VALUES (?, ?, "pending")',
      [student_id, internship_id]
    );
    
    const applicationId = result.insertId;
    const student = students[0];
    
    console.log('Application created:', {
      applicationId,
      student_id,
      internship_id,
      student_name: student.full_name
    });

    try {
      await pool.execute(
        `INSERT INTO notifications 
         (user_id, user_role, type, title, message, internship_id, application_id) 
         VALUES (?, 'company', 'new_application', 'Nueva Aplicación Recibida', ?, ?, ?)`,
        [
          internship.company_id,
          `${student.full_name} aplicó a "${internship.title}"`,
          internship_id,
          applicationId
        ]
      );
      
      console.log(' Notification created for company:', internship.company_id);
      
    } catch (notificationError) {
      console.error('❌ Error creating notification:', notificationError);
      // Don't fail the application if notification fails
    }
    
    // Also create a notification for the student
    try {
      await pool.execute(
        `INSERT INTO notifications 
         (user_id, user_role, type, title, message, internship_id, application_id) 
         VALUES (?, 'student', 'application_submitted', 'Aplicación Enviada', ?, ?, ?)`,
        [
          student_id,
          `Aplicaste exitosamente a "${internship.title}"`,
          internship_id,
          applicationId
        ]
      );
      
      console.log('✅ Notification created for student:', student_id);
      
    } catch (studentNotificationError) {
      console.error('❌ Error creating student notification:', studentNotificationError);
    }
    
    return NextResponse.json({ 
      success: true, 
      message: '¡Aplicación enviada con éxito!',
      application_id: applicationId 
    }, { status: 201 });
    
  } catch (error) {
    console.error('❌ Error creating application:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor: ' + error.message }, 
      { status: 500 }
    );
  }
}
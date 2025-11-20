import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request, { params }) {
  let connection;
  try {
    
    const { id } = await params; 
    const internshipId = parseInt(id);
    
    if (!internshipId || internshipId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid internship ID is required' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    const query = `
      SELECT 
        i.*,
        c.company_name,
        c.company_logo,
        c.industry,
        c.description as company_description,
        c.website as company_website,
        c.contact_name,
        c.email as company_email,
        c.phone as company_phone,
        c.verified
      FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.id = ? AND i.is_active = true
    `;

    const [rows] = await connection.execute(query, [internshipId]);

    if (rows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Internship not found' },
        { status: 404 }
      );
    }

    const internship = rows[0];

    // Parse benefits safely
    let benefits = [];
    try {
      if (internship.benefits) {
        benefits = typeof internship.benefits === 'string' 
          ? JSON.parse(internship.benefits) 
          : internship.benefits;
      }
    } catch (error) {
      console.warn('Benefits parse error:', error);
    }

    // Determine modality from schedule
    let modality = 'presencial';
    if (internship.schedule && internship.schedule.toLowerCase().includes('remote')) {
      modality = 'remoto';
    }

    // Determine journey
    let journey = 'full-time';

    // Transform data for frontend
    const transformedInternship = {
      id: internship.id,
      title: internship.title,
      description: internship.description,
      requirements: internship.work_area,
      modality: modality,
      location: internship.work_area,
      duration: internship.duration,
      salary: internship.salary,
      application_deadline: internship.end_date,
      journey: journey,
      benefits: benefits,
      company: {
        id: internship.company_id,
        name: internship.company_name,
        industry: internship.industry,
        description: internship.company_description,
        website: internship.company_website,
        logo: internship.company_logo,
        contact_name: internship.contact_name,
        email: internship.company_email,
        phone: internship.company_phone,
        verified: Boolean(internship.verified)
      },
      created_at: internship.created_at
    };

    return NextResponse.json({
      success: true,
      data: transformedInternship
    });

  } catch (error) {
    console.error('Internship detail error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error' 
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// PUT - Update internship
export async function PUT(request, { params }) {
  let connection;
  try {
    const { id } = await params;
    const internshipId = parseInt(id);
    const body = await request.json();
    
    // Validate internship ID
    if (!internshipId || internshipId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid internship ID is required' },
        { status: 400 }
      );
    }

    const { 
      title, 
      description, 
      startDate, 
      endDate, 
      workArea, 
      schedule, 
      salary, 
      duration, 
      benefits,
      companyId 
    } = body;

    // Validate required fields
    const requiredFields = ['title', 'startDate', 'endDate', 'workArea', 'schedule', 'companyId'];
    const missingFields = requiredFields.filter(field => !body[field]);
    
    if (missingFields.length > 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: `Missing required fields: ${missingFields.join(', ')}` 
        },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // First, verify the internship exists and belongs to the company
    const [existingInternship] = await connection.execute(
      'SELECT company_id FROM internships WHERE id = ?',
      [internshipId]
    );

    if (existingInternship.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Internship not found' },
        { status: 404 }
      );
    }

    // Verify ownership - only the company that created it can edit
    if (existingInternship[0].company_id !== companyId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only edit your own internships' },
        { status: 403 }
      );
    }

    // Handle benefits JSON
    let benefitsJson = '[]';
    if (benefits && Array.isArray(benefits) && benefits.length > 0) {
      benefitsJson = JSON.stringify(benefits);
    }

    // Update internship
    const updateQuery = `
      UPDATE internships 
      SET 
        title = ?, 
        description = ?, 
        start_date = ?, 
        end_date = ?, 
        work_area = ?, 
        schedule = ?, 
        salary = ?, 
        duration = ?, 
        benefits = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `;

    const values = [
      title,
      description || null,
      startDate,
      endDate,
      workArea,
      schedule,
      salary || null,
      duration || null,
      benefitsJson,
      internshipId
    ];

    const [result] = await connection.execute(updateQuery, values);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to update internship' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Internship updated successfully',
      internshipId: internshipId
    });

  } catch (error) {
    console.error('Error updating internship:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// DELETE - Delete internship (soft delete by setting is_active = false)
export async function DELETE(request, { params }) {
  let connection;
  try {
    const { id } = await params;
    const internshipId = parseInt(id);
    
    // Get companyId from query params to verify ownership
    const url = new URL(request.url);
    const companyId = url.searchParams.get('companyId');
    
    if (!internshipId || internshipId <= 0) {
      return NextResponse.json(
        { success: false, error: 'Valid internship ID is required' },
        { status: 400 }
      );
    }

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required for verification' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // First, verify the internship exists and belongs to the company
    const [existingInternship] = await connection.execute(
      'SELECT company_id FROM internships WHERE id = ?',
      [internshipId]
    );

    if (existingInternship.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Internship not found' },
        { status: 404 }
      );
    }

    // Verify ownership - only the company that created it can delete
    if (existingInternship[0].company_id !== parseInt(companyId)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized - You can only delete your own internships' },
        { status: 403 }
      );
    }

    // Soft delete by setting is_active = false
    const [result] = await connection.execute(
      'UPDATE internships SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [internshipId]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete internship' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting internship:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error'
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
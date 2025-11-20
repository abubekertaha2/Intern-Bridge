import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Get internships for a specific company
export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return NextResponse.json(
        { success: false, error: 'Company ID is required' },
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
        c.verified
      FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.company_id = ? AND i.is_active = true
      ORDER BY i.created_at DESC
    `;

    const [rows] = await connection.execute(query, [parseInt(companyId)]);

    // Transform data for frontend
    const internships = rows.map(internship => {
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

      return {
        id: internship.id,
        title: internship.title,
        description: internship.description,
        startDate: internship.start_date,
        endDate: internship.end_date,
        workArea: internship.work_area,
        schedule: internship.schedule,
        salary: internship.salary,
        duration: internship.duration,
        benefits: benefits,
        companyId: internship.company_id,
        createdAt: internship.created_at,
        company: {
          id: internship.company_id,
          name: internship.company_name,
          logo: internship.company_logo,
          industry: internship.industry,
          verified: Boolean(internship.verified)
        }
      };
    });

    return NextResponse.json({
      success: true,
      internships: internships
    });

  } catch (error) {
    console.error('Company internships error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// PUT - Update a specific internship (company must own it)
export async function PUT(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const internshipId = searchParams.get('internshipId');

    if (!companyId || !internshipId) {
      return NextResponse.json(
        { success: false, error: 'Company ID and Internship ID are required' },
        { status: 400 }
      );
    }

    const body = await request.json();
    const {
      title,
      description,
      startDate,
      endDate,
      workArea,
      schedule,
      salary,
      duration,
      benefits
    } = body;

    // Validate required fields
    if (!title || !startDate || !endDate || !workArea || !schedule) {
      return NextResponse.json(
        { success: false, error: 'All required fields must be provided' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // First, verify the internship belongs to this company
    const [verification] = await connection.execute(
      'SELECT id FROM internships WHERE id = ? AND company_id = ? AND is_active = true',
      [parseInt(internshipId), parseInt(companyId)]
    );

    if (verification.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Internship not found or access denied' },
        { status: 404 }
      );
    }

    // Handle benefits JSON
    let benefitsJson = '[]';
    if (benefits && Array.isArray(benefits) && benefits.length > 0) {
      benefitsJson = JSON.stringify(benefits);
    }

    // Update the internship
    const updateQuery = `
      UPDATE internships 
      SET 
        title = ?, description = ?, start_date = ?, end_date = ?,
        work_area = ?, schedule = ?, salary = ?, duration = ?, benefits = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ? AND company_id = ?
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
      parseInt(internshipId),
      parseInt(companyId)
    ];

    await connection.execute(updateQuery, values);

    return NextResponse.json({
      success: true,
      message: 'Internship updated successfully'
    });

  } catch (error) {
    console.error('Update internship error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// DELETE - Soft delete a specific internship (company must own it)
export async function DELETE(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    const companyId = searchParams.get('companyId');
    const internshipId = searchParams.get('internshipId');

    if (!companyId || !internshipId) {
      return NextResponse.json(
        { success: false, error: 'Company ID and Internship ID are required' },
        { status: 400 }
      );
    }

    connection = await pool.getConnection();

    // Verify the internship belongs to this company
    const [verification] = await connection.execute(
      'SELECT id FROM internships WHERE id = ? AND company_id = ? AND is_active = true',
      [parseInt(internshipId), parseInt(companyId)]
    );

    if (verification.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Internship not found or access denied' },
        { status: 404 }
      );
    }

    // Soft delete - set is_active = false
    await connection.execute(
      'UPDATE internships SET is_active = false, updated_at = CURRENT_TIMESTAMP WHERE id = ? AND company_id = ?',
      [parseInt(internshipId), parseInt(companyId)]
    );

    return NextResponse.json({
      success: true,
      message: 'Internship deleted successfully'
    });

  } catch (error) {
    console.error('Delete internship error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}
import { NextResponse } from 'next/server';
import pool from '@/lib/db';

// GET - Search internships with filters
export async function GET(request) {
  let connection;
  try {
    const { searchParams } = new URL(request.url);
    
    // Get search parameters from your frontend
    const search = searchParams.get('search') || '';
    const modality = searchParams.get('modality') || '';
    const location = searchParams.get('location') || '';
    const sector = searchParams.get('sector') || '';
    const journey = searchParams.get('journey') || '';

    connection = await pool.getConnection();

    // Build dynamic query for search
    let query = `
      SELECT 
        i.*,
        c.company_name,
        c.company_logo,
        c.industry,
        c.verified
      FROM internships i
      LEFT JOIN companies c ON i.company_id = c.id
      WHERE i.is_active = true
    `;

    const params = [];

    // Add search filters
    if (search) {
      query += ` AND (i.title LIKE ? OR i.description LIKE ? OR c.company_name LIKE ?)`;
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    // Map modality to schedule 
    if (modality && modality !== 'all') {
      if (modality === 'remoto') {
        query += ` AND i.schedule LIKE ?`;
        params.push('%remote%');
      } else if (modality === 'presencial') {
        query += ` AND i.schedule NOT LIKE ?`;
        params.push('%remote%');
      }
    }

    if (location && location !== 'all') {
      query += ` AND i.work_area LIKE ?`;
      params.push(`%${location}%`);
    }

    if (sector && sector !== 'all') {
      query += ` AND i.work_area = ?`;
      params.push(sector);
    }

    
    if (journey && journey !== 'all') {
    }

    query += ` ORDER BY i.created_at DESC LIMIT 50`;

    console.log('Search query:', query);
    console.log('Search params:', params);

    const [rows] = await connection.execute(query, params);

    // Transform data for frontend
    const internships = rows.map(internship => {
      // Determine modality from schedule 
      let modality = 'presencial';
      if (internship.schedule && internship.schedule.toLowerCase().includes('remote')) {
        modality = 'remoto';
      }
      let journey = 'full-time';
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
        requirements: internship.work_area,
        modality: modality,
        location: internship.work_area,
        duration: internship.duration,
        salary: internship.salary,
        application_deadline: internship.end_date,
        journey: journey,
        company: {
          id: internship.company_id,
          name: internship.company_name,
          industry: internship.industry,
          logo: internship.company_logo,
          verified: Boolean(internship.verified)
        },
        created_at: internship.created_at
      };
    });

    return NextResponse.json({
      success: true,
      data: {
        internships: internships,
        total: internships.length
      }
    });

  } catch (error) {
    console.error('Internship search error:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Internal server error: ' + error.message
      },
      { status: 500 }
    );
  } finally {
    if (connection) connection.release();
  }
}

// POST - Create internship 
export async function POST(request) {
  let connection;
  try {
    const body = await request.json();
    
    const { companyId, title, description, startDate, endDate, workArea, schedule, salary, duration, benefits } = body;
    
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

    // Verify company exists
    const [companyRows] = await connection.execute(
      'SELECT id FROM companies WHERE id = ?',
      [companyId]
    );

    if (companyRows.length === 0) {
      return NextResponse.json(
        { success: false, error: 'Company not found' },
        { status: 404 }
      );
    }

    // Handle benefits JSON
    let benefitsJson = '[]';
    if (benefits && Array.isArray(benefits) && benefits.length > 0) {
      benefitsJson = JSON.stringify(benefits);
    }

    // Insert internship
    const query = `
      INSERT INTO internships (
        title, description, company_id, start_date, end_date, 
        work_area, schedule, salary, duration, benefits
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      title,
      description || null,
      companyId,
      startDate,
      endDate,
      workArea,
      schedule,
      salary || null,
      duration || null,
      benefitsJson
    ];

    const [result] = await connection.execute(query, values);
    
    // Get the newly created internship
    const [internshipRows] = await connection.execute(
      'SELECT * FROM internships WHERE id = ?',
      [result.insertId]
    );

    const internship = internshipRows[0];

    // Safe JSON parsing with fallback
    let parsedBenefits = [];
    try {
      if (internship.benefits) {
        parsedBenefits = typeof internship.benefits === 'string' 
          ? JSON.parse(internship.benefits) 
          : internship.benefits;
      }
    } catch (parseError) {
      console.warn('Error parsing benefits, using empty array:', parseError);
      parsedBenefits = [];
    }

    return NextResponse.json({
      success: true,
      internship: {
        id: internship.id,
        title: internship.title,
        description: internship.description,
        startDate: internship.start_date,
        endDate: internship.end_date,
        workArea: internship.work_area,
        schedule: internship.schedule,
        salary: internship.salary,
        duration: internship.duration,
        benefits: parsedBenefits,
        companyId: internship.company_id,
        createdAt: internship.created_at,
      }
    });

  } catch (error) {
    console.error('Error creating internship:', error);
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
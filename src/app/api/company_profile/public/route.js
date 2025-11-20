import pool from '@/lib/db';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const companyId = searchParams.get('companyId');

    if (!companyId) {
      return new Response(
        JSON.stringify({ success: false, error: 'Company ID is required' }),
        { status: 400 }
      );
    }

    // Query company details
    const [companies] = await pool.execute(
      `
      SELECT 
        id,
        company_name AS name,
        industry,
        company_size AS size,
        description,
        website,
        founded_year,
        company_logo AS logo,
        verified,
        premium_partner,
        contact_name AS hr_contact_name,
        email,
        phone
      FROM companies
      WHERE id = ?
      `,
      [companyId]
    );

    if (!companies || companies.length === 0) {
      return new Response(
        JSON.stringify({ success: false, error: 'Company not found' }),
        { status: 404 }
      );
    }

    const company = companies[0];

    // Fetch company internships 
    const [internships] = await pool.execute(
      `
      SELECT 
        id,
        title,
        location,
        salary,
        duration,
        application_deadline
      FROM internships
      WHERE company_id = ?
      ORDER BY created_at DESC
      `,
      [companyId]
    );

    return new Response(
      JSON.stringify({ success: true, company, internships }),
      { status: 200 }
    );

  } catch (error) {
    console.error('Error fetching public company profile:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Internal server error' }),
      { status: 500 }
    );
  }
}

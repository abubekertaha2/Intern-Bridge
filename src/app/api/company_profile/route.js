import { NextResponse } from 'next/server';
import { 
  getCompanyProfileById,
  updateCompanyProfile,
  getCompanyLocations,
  getCompanyBenefits,
  getCompanyStatistics,
  updateCompanyLocations,
  updateCompanyBenefits
} from '@/lib/companyModel';

// GET - Get company profile 
export async function GET(request) {
  try {
    // Get companyId from query parameters 
    const url = new URL(request.url);
    const companyId = url.searchParams.get('companyId');
    const parsedCompanyId = parseInt(companyId);

    // Validate company ID
    if (!parsedCompanyId || parsedCompanyId <= 0) {
      return NextResponse.json({ error: 'Valid company ID is required' }, { status: 400 });
    }

    const [company, locations, benefits, statistics] = await Promise.all([
      getCompanyProfileById(parsedCompanyId),
      getCompanyLocations(parsedCompanyId),
      getCompanyBenefits(parsedCompanyId),
      getCompanyStatistics(parsedCompanyId)
    ]);

    if (!company) {
      return NextResponse.json({ error: 'Company not found' }, { status: 404 });
    }

    // TRANSFORM DATA BACK TO ORIGINAL STRUCTURE
    const companyProfile = {
      id: company.id,
      name: company.company_name,          
      industry: company.industry,            
      size: company.company_size,          
      founded_year: company.founded_year,  
      website: company.website,            
      description: company.description,    
      verified: Boolean(company.verified),
      premium_partner: Boolean(company.premium_partner),
      logo: company.company_logo,           
      hr_contact_name: company.contact_name,
      hr_contact_position: company.contact_position,
      email: company.email,
      phone: company.phone,
      created_at: company.created_at,
      updated_at: company.updated_at,
      active_internships: statistics.active_internships,
      conversion_rate: statistics.conversion_rate,
      rating: statistics.rating,
      past_internships: statistics.past_internships,
      locations: locations.map(loc => ({
        id: loc.id,
        name: loc.location_name,
        address: loc.address,
        is_remote: Boolean(loc.is_remote),
        is_primary: Boolean(loc.is_primary)
      })),
      benefits: benefits
    };

    
    return NextResponse.json({ 
      success: true,
      company: companyProfile 
    });

  } catch (error) {
    console.error('Error fetching company profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT - Update company profile 
export async function PUT(request) {
  try {
    // Get companyId from request body
    const requestData = await request.json();
    const { companyId, ...updateFields } = requestData;

    const parsedCompanyId = parseInt(companyId || 1);

    // Validate company ID
    if (!parsedCompanyId || parsedCompanyId <= 0) {
      return NextResponse.json({ error: 'Valid company ID is required' }, { status: 400 });
    }

    const {
      name,
      industry,
      size,
      founded_year,
      website,
      description,
      locations,
      benefits,
      hr_contact_name,
      hr_contact_position,
      email,
      phone,
      logo_url
    } = updateFields;

    // Prepare update data for main company profile
    const updateData = {
      company_name: name,
      industry,
      company_size: size,
      founded_year: founded_year ? parseInt(founded_year) : null,
      website,
      description,
      contact_name: hr_contact_name,
      contact_position: hr_contact_position,
      email,
      phone,
      company_logo: logo_url
    };

    // Update main company profile
    const updateSuccess = await updateCompanyProfile(parsedCompanyId, updateData);

    if (!updateSuccess) {
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
    }

    // Update locations if provided
    if (locations && Array.isArray(locations)) {
      try {
        await updateCompanyLocations(parsedCompanyId, locations);
      } catch (locationError) {
        console.error('Location update error:', locationError);
      }
    }

    // Update benefits if provided
    if (benefits && Array.isArray(benefits)) {
      try {
        await updateCompanyBenefits(parsedCompanyId, benefits);
      } catch (benefitsError) {
        console.error('Benefits update error:', benefitsError);
      }
    }

    return NextResponse.json({ 
      success: true,
      message: 'Company profile updated successfully',
      companyId: parsedCompanyId 
    });

  } catch (error) {
    console.error('Error updating company profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
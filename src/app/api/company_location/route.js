import { NextResponse } from 'next/server';
import { 
  getCompanyLocations,
  updateCompanyLocations 
} from '../../../../lib/companyModel';

const getCompanyIdFromRequest = async (request) => {
  
  const email = request.headers.get('x-company-email');
  if (email) {
    const { getCompanyProfileByEmail } = await import('../../../../lib/companyModel');
    const company = await getCompanyProfileByEmail(email);
    return company ? company.id : null;
  }
  return null;
};

export async function GET(request) {
  try {
    const companyId = await getCompanyIdFromRequest(request);
    
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const locations = await getCompanyLocations(companyId);
    
    return NextResponse.json({ 
      success: true,
      locations 
    });

  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}

export async function PUT(request) {
  try {
    const companyId = await getCompanyIdFromRequest(request);
    
    if (!companyId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { locations } = await request.json();
    
    if (!locations || !Array.isArray(locations)) {
      return NextResponse.json(
        { success: false, error: 'Invalid locations data' }, 
        { status: 400 }
      );
    }

    await updateCompanyLocations(companyId, locations);
    
    return NextResponse.json({ 
      success: true,
      message: 'Locations updated successfully' 
    });

  } catch (error) {
    console.error('Error updating locations:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
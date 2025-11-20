import { NextResponse } from 'next/server';
import { 
  getCompanyBenefits,
  updateCompanyBenefits 
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

    const benefits = await getCompanyBenefits(companyId);
    
    return NextResponse.json({ 
      success: true,
      benefits 
    });

  } catch (error) {
    console.error('Error fetching benefits:', error);
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

    const { benefits } = await request.json();
    
    if (!benefits || !Array.isArray(benefits)) {
      return NextResponse.json(
        { success: false, error: 'Invalid benefits data' }, 
        { status: 400 }
      );
    }

    await updateCompanyBenefits(companyId, benefits);
    
    return NextResponse.json({ 
      success: true,
      message: 'Benefits updated successfully' 
    });

  } catch (error) {
    console.error('Error updating benefits:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error' }, 
      { status: 500 }
    );
  }
}
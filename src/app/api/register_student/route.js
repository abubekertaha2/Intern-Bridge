import { NextResponse } from 'next/server';
import { getStudentById, updateStudent } from '../../../../lib/studentModel';

// GET - Fetch student profile
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    console.log("🔍 Fetching student with ID:", id);
    
    const student = await getStudentById(id);

    if (!student) {
      console.log("❌ Student not found with ID:", id);
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    console.log("Student found:", {
      id: student.id,
      skillsCount: student.skills?.length,
      languagesCount: student.languages?.length
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("💥 Error fetching student profile:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update entire student profile
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const updateData = await req.json();
    
    console.log("UPDATE REQUEST FOR STUDENT:", id);
    console.log("UPDATE DATA:", {
      skills: updateData.skills,
      languages: updateData.languages,
      hasSkills: !!updateData.skills,
      hasLanguages: !!updateData.languages
    });

    // Validate required fields
    if (!updateData.full_name || !updateData.email) {
      return NextResponse.json(
        { error: 'Full name and email are required' }, 
        { status: 400 }
      );
    }

    const updatedStudent = await updateStudent(id, updateData);
    
    console.log("✅ UPDATE SUCCESSFUL:", {
      skills: updatedStudent.skills,
      languages: updatedStudent.languages
    });

    return NextResponse.json(updatedStudent);
    
  } catch (error) {
    console.error(" Error updating student profile:", error);
    return NextResponse.json(
      { error: 'Internal Server Error: ' + error.message }, 
      { status: 500 }
    );
  }
}

// PATCH - Update partial student data 
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const partialData = await req.json();
    
    console.log("🔧 PATCH UPDATE FOR STUDENT:", id);
    console.log("📦 PARTIAL DATA:", partialData);

    // Get current student data first
    const currentStudent = await getStudentById(id);
    if (!currentStudent) {
      return NextResponse.json({ error: 'Student not found' }, { status: 404 });
    }

    // Merge current data with partial updates
    const mergedData = {
      ...currentStudent,
      ...partialData,
     
      skills: partialData.skills !== undefined ? partialData.skills : currentStudent.skills,
      languages: partialData.languages !== undefined ? partialData.languages : currentStudent.languages
    };

    const updatedStudent = await updateStudent(id, mergedData);
    return NextResponse.json(updatedStudent);
    
  } catch (error) {
    console.error("💥 Error in PATCH update:", error);
    return NextResponse.json(
      { error: 'Internal Server Error' }, 
      { status: 500 }
    );
  }
}
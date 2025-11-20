import { NextResponse } from 'next/server';
import { getStudentById, updateStudent, updateStudentSkills } from '../../../lib/studentModel';

// GET - Fetch student profile
export async function GET(req, { params }) {
  try {
    const { id } = await params;
    console.log("Fetching student with ID:", id);
    
    const student = await getStudentById(id);

    if (!student) {
      console.log("Student not found with ID:", id);
      return NextResponse.json({ message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json(student);
  } catch (error) {
    console.error("Error fetching student profile:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}

// PUT - Update entire student profile
export async function PUT(req, { params }) {
  try {
    const { id } = await params;
    const updateData = await req.json();
    
    const updatedStudent = await updateStudent(id, updateData);
    return NextResponse.json(updatedStudent);
    
  } catch (error) {
    console.error("Error updating student profile:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// PATCH - Update only skills 
export async function PATCH(req, { params }) {
  try {
    const { id } = await params;
    const { skills } = await req.json();
    
    // Validate skills array
    if (!Array.isArray(skills)) {
      return NextResponse.json({ error: 'Skills must be an array' }, { status: 400 });
    }
    
    // Validate max 10 skills
    if (skills.length > 10) {
      return NextResponse.json({ error: 'Maximum 10 skills allowed' }, { status: 400 });
    }
    
    // Update skills in database
    const updatedStudent = await updateStudentSkills(id, skills);
    return NextResponse.json(updatedStudent);
    
  } catch (error) {
    console.error("Error updating student skills:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
} 

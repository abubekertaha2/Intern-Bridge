
import { registerStudent, checkEmailExists } from '../../lib/studentModel';
import { uploadDir, cleanupFile } from '../../lib/upload'; 
import fs from 'fs/promises'; 
import path from 'path';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

async function saveFile(file, uploadedFileName) {
    if (!file || file.size === 0) return null;

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error("Solo se permiten archivos JPG, PNG o PDF.");
    }
    if (file.size > 5 * 1024 * 1024) {
        throw new Error("El archivo es demasiado grande (máximo 5MB).");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filePath = path.join(uploadDir, uploadedFileName);
    await fs.writeFile(filePath, buffer);

    return `/uploads/${uploadedFileName}`;
}

export async function POST(request) { 
    let uploadedFileName = null;

    try {
        // 1. CRITICAL: Safely read the body using the native formData() method
        const formData = await request.formData();
        
        // 2. Extract all text fields (they are guaranteed to be strings here)
        const fullName = formData.get('fullName');
        const email = formData.get('email');
        const optionalEmail = formData.get('optionalEmail');
        const phone = formData.get('phone');
        const university = formData.get('university');
        const career = formData.get('career');
        const semester = formData.get('semester');
        const gpa = formData.get('gpa');
        const password = formData.get('password');
        
        // 3. Extract the file object (the name must match the frontend input)
        const studentIdCardFile = formData.get('studentIdCard'); // This is a File object
        
        // 4. Validation
        if (!fullName || !email || !phone || !university || !career || !semester || !password) {
            // Note: No cleanup needed yet as the file hasn't been saved
            return NextResponse.json({ message: "Por favor, completa todos los campos requeridos." }, { status: 400 });
        }
        
        // 5. File Processing
        let studentCardPath = null;
        if (studentIdCardFile instanceof File && studentIdCardFile.size > 0) {
            // Create a unique filename BEFORE saving
            const fileExtension = path.extname(studentIdCardFile.name);
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
            uploadedFileName = `student_card-${uniqueSuffix}${fileExtension}`;
            
            // Save the file and get the public path
            studentCardPath = await saveFile(studentIdCardFile, uploadedFileName);
        }

        // 6. Check Email Existence
        const exists = await checkEmailExists(email);
        if (exists) {
            cleanupFile(uploadedFileName);
            return NextResponse.json({ message: "El correo electrónico ya está registrado." }, { status: 409 });
        }

        // 7. Hash Password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // 8. Prepare Data for DB
        const data = [
            fullName, 
            email, 
            optionalEmail || null, 
            phone, 
            university, 
            career, 
            semester, 
            parseFloat(gpa) || null, 
            passwordHash, 
            studentCardPath
        ];

        // 9. Register Student
        const { id, createdAt } = await registerStudent(data); 
        
        return NextResponse.json({ message: "¡Registro exitoso! Tu cuenta ha sido creada.", id, createdAt }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        // Only clean up the file if an error occurs AFTER a file name was generated
        if (uploadedFileName) {
            cleanupFile(uploadedFileName);
        }
        
        let userMessage = error.message || "Error interno del servidor al registrar.";
        
        return NextResponse.json({ 
            message: userMessage, 
            error: error.message 
        }, { status: 500 });
    }
}
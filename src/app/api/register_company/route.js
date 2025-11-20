import { registerCompany, checkCompanyEmailExists } from '@/lib/companyModel';
import { uploadDir, cleanupFile } from '@/lib/upload'; 
import fs from 'fs/promises';
import path from 'path';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

async function saveFile(file) {
    if (!file || file.size === 0) return { fileName: null, filePath: null };

    const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
        throw new Error("Solo se permiten archivos JPG, PNG o PDF para el logo.");
    }
    if (file.size > 5 * 1024 * 1024) { 
        throw new Error("El archivo de logo es demasiado grande (máximo 5MB).");
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
 
    const fileExtension = path.extname(file.name);
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const uploadedFileName = `company_logo-${uniqueSuffix}${fileExtension}`;
    
    const filePath = path.join(uploadDir, uploadedFileName);
    await fs.writeFile(filePath, buffer);

    return { fileName: uploadedFileName, filePath: `/uploads/${uploadedFileName}` };
}


export async function POST(request) { 
    let uploadedFileName = null; 

    try {
        // 1. Read the native FormData
        const formData = await request.formData();
        
        // 2. Extract all fields 
        const companyName = formData.get('companyName');
        const industry = formData.get('industry');
        const companySize = formData.get('companySize');
        const description = formData.get('description');
        const website = formData.get('website');
        const contactName = formData.get('contactName');
        const contactPosition = formData.get('contactPosition');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const password = formData.get('password');
        
        const companyLogoFile = formData.get('companyLogo'); 

        // 3. Validation: Check for required fields
        if (!companyName || !industry || !companySize || !description || 
            !contactName || !contactPosition || !email || !phone || !password) {
            
            return NextResponse.json({ message: "Por favor, completa todos los campos requeridos." }, { status: 400 });
        }
        
        // 4. File Processing and Validation
        let companyLogoPath = null;
        if (companyLogoFile instanceof File && companyLogoFile.size > 0) {
            const fileResult = await saveFile(companyLogoFile);
            uploadedFileName = fileResult.fileName; 
            companyLogoPath = fileResult.filePath;
        } else {
            // Handle the required logo validation 
            return NextResponse.json({ message: "El logo de la empresa es obligatorio." }, { status: 400 });
        }


        // 5. Check Email Existence
        const exists = await checkCompanyEmailExists(email);
        if (exists) {
            cleanupFile(uploadedFileName);
            return NextResponse.json({ message: "El correo electrónico ya está registrado." }, { status: 409 });
        }

        // 6. Hash Password
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(password, saltRounds);
        
        // 7. Prepare Data for DB 
        const data = [
            companyName, industry, companySize, description, website || null, contactName, 
            contactPosition, email, phone, passwordHash, companyLogoPath
        ];

        const { id, createdAt } = await registerCompany(data); 
        
        return NextResponse.json({ message: "¡Registro exitoso! Tu empresa ha sido registrada.", id, createdAt }, { status: 201 });

    } catch (error) {
        console.error("Registration error:", error);
        
        if (uploadedFileName) {
            cleanupFile(uploadedFileName);
        }
        
        let userMessage = error.message;
        
        return NextResponse.json({ message: userMessage, error: error.message }, { status: 500 });
    }
}
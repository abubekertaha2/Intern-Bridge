import pool from './db';

export const registerStudent = async (data) => {
  const query = `
    INSERT INTO students 
    (full_name, email, optional_email, phone, university, career, semester, gpa, password, student_card) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, data);
  return {
    id: result.insertId, 
    createdAt: new Date().toISOString(), 
  };
};

export const checkEmailExists = async (email) => {
  const query = `SELECT email FROM students WHERE email = ?`;
  const [rows] = await pool.execute(query, [email]);
  return rows.length > 0;
};

export const getStudentById = async (id) => {
  const query = `
    SELECT id, full_name, email, optional_email, phone, university, career, 
           semester, gpa, student_card, skills, languages, profile_image_url
    FROM students
    WHERE id = ?
  `;
  const [rows] = await pool.execute(query, [id]);
  
  if (rows[0]) {
    const student = rows[0];
    
    console.log("🔍 RAW DATA FROM DATABASE:", {
      rawSkills: student.skills,
      rawLanguages: student.languages,
      typeOfSkills: typeof student.skills,
      typeOfLanguages: typeof student.languages,
      isArraySkills: Array.isArray(student.skills),
      isArrayLanguages: Array.isArray(student.languages)
    });
    if (student.skills) {
      if (typeof student.skills === 'string') {
        try {
          student.skills = JSON.parse(student.skills);
          console.log("✅ Parsed skills from string:", student.skills);
        } catch (error) {
          console.error("❌ Error parsing skills string:", error);
          student.skills = [];
        }
      } else if (Array.isArray(student.skills)) {
        console.log("✅ Skills is already an array:", student.skills);
      } else {
        console.log("⚠️ Skills in unknown format, setting to empty array");
        student.skills = [];
      }
    } else {
      // Null or undefined, set to empty array
      console.log("ℹ️ Skills is null/undefined, setting to empty array");
      student.skills = [];
    }
    
    // Handle languages - they might already be parsed by the MySQL driver
    if (student.languages) {
      if (typeof student.languages === 'string') {
        // If it's a string, try to parse it as JSON
        try {
          student.languages = JSON.parse(student.languages);
          console.log("✅ Parsed languages from string:", student.languages);
        } catch (error) {
          console.error("❌ Error parsing languages string:", error);
          student.languages = [];
        }
      } else if (Array.isArray(student.languages)) {
        // Already an array - use as is
        console.log("✅ Languages is already an array:", student.languages);
      } else {
        // Unknown format, set to empty array
        console.log("⚠️ Languages in unknown format, setting to empty array");
        student.languages = [];
      }
    } else {
      // Null or undefined, set to empty array
      console.log("ℹ️ Languages is null/undefined, setting to empty array");
      student.languages = [];
    }
    
    // Ensure both are proper arrays
    student.skills = Array.isArray(student.skills) ? student.skills : [];
    student.languages = Array.isArray(student.languages) ? student.languages : [];
    
    console.log("📥 FINAL PARSED STUDENT DATA:", {
      id: student.id,
      skills: student.skills,
      languages: student.languages,
      skillsLength: student.skills.length,
      languagesLength: student.languages.length
    });
    
    return student;
  }
  
  return null;
};

export const updateStudent = async (id, data) => {
  console.log("💾 STARTING UPDATE FOR STUDENT:", id);
  console.log("📤 UPDATE DATA RECEIVED:", {
    skills: data.skills,
    languages: data.languages,
    skillsType: typeof data.skills,
    languagesType: typeof data.languages,
    isArraySkills: Array.isArray(data.skills),
    isArrayLanguages: Array.isArray(data.languages)
  });

  // Ensure skills and languages are arrays
  const skillsArray = Array.isArray(data.skills) ? data.skills : [];
  const languagesArray = Array.isArray(data.languages) ? data.languages : [];

  console.log("🔄 CONVERTED TO ARRAYS:", {
    skillsArray: skillsArray,
    languagesArray: languagesArray
  });

  const query = `
    UPDATE students 
    SET full_name = ?, optional_email = ?, phone = ?, university = ?, 
        career = ?, semester = ?, gpa = ?, student_card = ?, 
        skills = ?, languages = ?, profile_image_url = ?
    WHERE id = ?
  `;
  
  // Convert arrays to JSON strings for database storage
  const skillsJson = JSON.stringify(skillsArray);
  const languagesJson = JSON.stringify(languagesArray);
  
  console.log("📝 JSON STRINGS FOR DATABASE:", {
    skillsJson: skillsJson,
    languagesJson: languagesJson
  });

  const values = [
    data.full_name || '', 
    data.optional_email || '', 
    data.phone || '', 
    data.university || '',
    data.career || '', 
    parseInt(data.semester) || 0, 
    parseFloat(data.gpa) || 0, 
    data.student_card || '', 
    skillsJson, 
    languagesJson,
    data.profile_image_url || '',
    id
  ];
  
  console.log("🚀 EXECUTING QUERY WITH VALUES:", values);
  
  try {
    await pool.execute(query, values);
    console.log("✅ DATABASE UPDATE SUCCESSFUL");
    
    // Return the updated student
    const updatedStudent = await getStudentById(id);
    console.log("🔄 UPDATED STUDENT RETURNED:", {
      skills: updatedStudent.skills,
      languages: updatedStudent.languages
    });
    
    return updatedStudent; 
  } catch (error) {
    console.error("❌ DATABASE UPDATE ERROR:", error);
    throw error;
  }
};

export const updateStudentSkills = async (id, skills) => {
  const skillsArray = Array.isArray(skills) ? skills : [];
  const skillsJson = JSON.stringify(skillsArray);
  
  const query = `UPDATE students SET skills = ? WHERE id = ?`;
  await pool.execute(query, [skillsJson, id]);
  return getStudentById(id); 
};
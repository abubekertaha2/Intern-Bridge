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
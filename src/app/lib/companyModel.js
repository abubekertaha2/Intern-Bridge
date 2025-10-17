import pool from './db'; 

export const registerCompany = async (data) => {
  const query = `
    INSERT INTO companies 
    (company_name, industry, company_size, description, website, contact_name, 
     contact_position, email, phone, password_hash, company_logo) 
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const [result] = await pool.execute(query, data);
  return {
    id: result.insertId, 
    createdAt: new Date().toISOString(), 
  };
};

export const checkCompanyEmailExists = async (email) => {
  const query = `SELECT email FROM companies WHERE email = ?`;
  const [rows] = await pool.execute(query, [email]);
  return rows.length > 0;
};
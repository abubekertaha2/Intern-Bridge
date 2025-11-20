import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const student_id = searchParams.get('student_id');
    
    if (!student_id) {
      return NextResponse.json({ error: 'Student ID is required' }, { status: 400 });
    }
    
    const [notifications] = await pool.execute(`
      SELECT n.*, i.title as internship_title 
      FROM notifications n
      JOIN applications a ON n.application_id = a.id
      JOIN internships i ON a.internship_id = i.id
      WHERE a.student_id = ?
      ORDER BY n.created_at DESC
      LIMIT 50
    `, [student_id]);
    
    const unreadCount = notifications.filter(n => !n.is_read).length;
    
    return NextResponse.json({ 
      notifications, 
      unread_count: unreadCount 
    });
    
  } catch (error) {
    console.error('Error fetching student notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
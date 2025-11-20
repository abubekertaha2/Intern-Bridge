import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function PATCH(request) {
  try {
    const { notification_id } = await request.json();
    
    if (!notification_id) {
      return NextResponse.json({ error: 'Notification ID is required' }, { status: 400 });
    }
    
    await pool.execute(
      'UPDATE notifications SET is_read = TRUE WHERE id = ?',
      [notification_id]
    );
    
    return NextResponse.json({ success: true });
    
  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
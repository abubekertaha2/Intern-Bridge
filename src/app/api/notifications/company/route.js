import { NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');
    const type = searchParams.get('type');
    const unread_only = searchParams.get('unread_only');

    if (!company_id) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    let query = `
      SELECT 
        n.*,
        i.title as internship_title,
        s.full_name as student_name,
        a.status as application_status
      FROM notifications n
      LEFT JOIN internships i ON n.internship_id = i.id
      LEFT JOIN applications a ON n.application_id = a.id
      LEFT JOIN students s ON a.student_id = s.id
      WHERE n.user_id = ? AND n.user_role = 'company'
    `;
    
    const params = [company_id];

    if (unread_only === 'true') {
      query += ' AND n.is_read = 0';
    }

    if (type) {
      query += ' AND n.type = ?';
      params.push(type);
    }

    query += ' ORDER BY n.created_at DESC LIMIT 50';

    const [notifications] = await pool.execute(query, params);

    const [unreadCountResult] = await pool.execute(
      'SELECT COUNT(*) as count FROM notifications WHERE user_id = ? AND user_role = "company" AND is_read = 0',
      [company_id]
    );

    return NextResponse.json({
      notifications,
      unread_count: unreadCountResult[0].count
    });

  } catch (error) {
    console.error('Error fetching company notifications:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function PATCH(request) {
  try {
    const { notification_id, mark_all } = await request.json();
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');

    if (!company_id) {
      return NextResponse.json({ error: 'Company ID required' }, { status: 400 });
    }

    if (mark_all) {
      await pool.execute(
        'UPDATE notifications SET is_read = 1 WHERE user_id = ? AND user_role = "company"',
        [company_id]
      );
    } else if (notification_id) {
      await pool.execute(
        'UPDATE notifications SET is_read = 1 WHERE id = ? AND user_id = ?',
        [notification_id, company_id]
      );
    } else {
      return NextResponse.json({ error: 'Notification ID or mark_all required' }, { status: 400 });
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Error updating notification:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
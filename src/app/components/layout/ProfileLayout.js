'use client';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Bell, UserPlus, Eye, CheckCircle, XCircle, Clock, User, LogOut } from 'lucide-react';

// Student Notification Bell Component
const StudentNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);

  const studentId = typeof window !== 'undefined' ? localStorage.getItem('currentUserId') : null;

  useEffect(() => {
    if (studentId) {
      fetchNotifications();
      // Poll for new notifications every 30 seconds
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [studentId]);

  const fetchNotifications = async () => {
    try {
      const res = await fetch(`/api/notifications/student?student_id=${studentId}`);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching student notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'application_submitted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'application_viewed': return <Eye className="w-4 h-4 text-blue-500" />;
      case 'application_reviewed': return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'interview_invite': return <User className="w-4 h-4 text-purple-500" />;
      case 'application_accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'application_rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">Notificaciones</h3>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay notificaciones
              </div>
            ) : (
              notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => markAsRead(notification.id)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

const CompanyNotificationBell = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [filter, setFilter] = useState('all');

  const companyId = typeof window !== 'undefined' ? localStorage.getItem('companyId') : null;

  useEffect(() => {
    if (companyId) {
      fetchNotifications();
      const interval = setInterval(fetchNotifications, 30000);
      return () => clearInterval(interval);
    }
  }, [companyId, filter]);

  const fetchNotifications = async () => {
    try {
      const url = `/api/notifications/company?company_id=${companyId}${
        filter === 'unread' ? '&unread_only=true' : ''
      }${filter !== 'all' && filter !== 'unread' ? `&type=${filter}` : ''}`;
      
      const res = await fetch(url);
      if (res.ok) {
        const data = await res.json();
        setNotifications(data.notifications || []);
        setUnreadCount(data.unread_count || 0);
      }
    } catch (error) {
      console.error('Error fetching company notifications:', error);
    }
  };

  const markAsRead = async (notificationId) => {
    try {
      await fetch(`/api/notifications/company?company_id=${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notification_id: notificationId })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await fetch(`/api/notifications/company?company_id=${companyId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mark_all: true })
      });
      fetchNotifications();
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'new_application': return <UserPlus className="w-4 h-4 text-green-500" />;
      case 'application_withdrawn': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'application_accepted': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'application_rejected': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'interview_scheduled': return <Clock className="w-4 h-4 text-purple-500" />;
      case 'student_review': return <Star className="w-4 h-4 text-yellow-500" />;
      case 'internship_expiring': return <AlertTriangle className="w-4 h-4 text-orange-500" />;
      default: return <Bell className="w-4 h-4 text-gray-500" />;
    }
  };

  const handleNotificationClick = (notification) => {
    markAsRead(notification.id);
    
    if (notification.application_id) {
      window.location.href = `/company/applications/${notification.application_id}`;
    } else if (notification.internship_id) {
      window.location.href = `/company/internships/${notification.internship_id}`;
    }
  };

  const filteredNotifications = notifications.slice(0, 10);

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="relative p-2 text-gray-400 hover:text-blue-600 transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center text-[10px]">
            {unreadCount}
          </span>
        )}
      </button>

      {showDropdown && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-lg shadow-xl border border-gray-200 z-50">
          <div className="p-4 border-b border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-semibold text-gray-900">Notificaciones</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-600 hover:text-blue-800"
                  >
                    Marcar todo como leído
                  </button>
                )}
                <span className="text-xs text-gray-500">{unreadCount} sin leer</span>
              </div>
            </div>
            
            {/* Filter Tabs */}
            <div className="flex gap-1 text-xs">
              {['all', 'unread', 'new_application', 'student_review'].map(f => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-2 py-1 rounded ${
                    filter === f 
                      ? 'bg-blue-100 text-blue-600' 
                      : 'text-gray-500 hover:text-gray-700'
                  }`}
                >
                  {f === 'all' ? 'Todos' : 
                   f === 'unread' ? 'Sin leer' : 
                   f === 'new_application' ? 'Aplicaciones' : 'Reseñas'}
                </button>
              ))}
            </div>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {filteredNotifications.length === 0 ? (
              <div className="p-4 text-center text-gray-500">
                No hay notificaciones
              </div>
            ) : (
              filteredNotifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    !notification.is_read ? 'bg-blue-50' : ''
                  }`}
                  onClick={() => handleNotificationClick(notification)}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {notification.title}
                      </p>
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      {notification.student_name && (
                        <p className="text-xs text-gray-500 mt-1">
                          Estudiante: {notification.student_name}
                        </p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(notification.created_at).toLocaleDateString('es-ES')}
                      </p>
                    </div>
                    {!notification.is_read && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          <div className="p-3 border-t border-gray-200 text-center">
            <Link 
              href="/company/notifications" 
              className="text-sm text-blue-600 hover:text-blue-800"
              onClick={() => setShowDropdown(false)}
            >
              Ver todas las notificaciones
            </Link>
          </div>
        </div>
      )}
    </div>
  );
};

const ProfileLayout = ({ children, userType = 'student', isOwnProfile = false }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUserType, setCurrentUserType] = useState(userType);

  useEffect(() => {
    // Check if user is logged in
    if (typeof window !== 'undefined') {
      const userId = localStorage.getItem('currentUserId');
      const companyId = localStorage.getItem('companyId');
      const userRole = localStorage.getItem('userRole');
      
      setIsLoggedIn(!!userId || !!companyId);
      setCurrentUserType(userRole || userType);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('currentUserId');
    localStorage.removeItem('companyId');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userName');
    localStorage.removeItem('companyName');
    window.location.href = '/';
  };

  return (
    <div className="min-h-screen p-0 flex flex-col bg-[#1C274D] text-white">
      <header className="">
        <nav className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="InternHub Logo"
              width={70}
              height={70}
              className="object-contain" 
            />
          </Link>
          
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="hover:text-blue-600">Inicio</Link>
            <Link href="/internship_search" className="hover:text-blue-600">Pasantías</Link>
            <Link href="/company_directory" className="hover:text-blue-600">Empresas</Link>
            <Link href="/contact" className="hover:text-blue-600">Contacto</Link>
          </div>

          <div className="flex items-center gap-4">
            {/* Show bell icon only when logged in and viewing OWN profile */}
            {isLoggedIn && isOwnProfile && (
              <>
                {currentUserType === 'student' && <StudentNotificationBell />}
                {currentUserType === 'company' && <CompanyNotificationBell />}
              </>
            )}

            <>
              <Link
                href="/login"
                className="px-4 py-2 text-sm bg-red-700 rounded-lg font-medium text-gray-300 hover:text-blue-600 hover:bg-red-600 transition-colors"
              >
                Iniciar sesión
              </Link>
              <Link
                href="/dashboard"
                className="px-4 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Registrarse
              </Link>
            </>
          </div>
        </nav>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        {children}
      </main>
    </div>
  );
};

export default ProfileLayout;
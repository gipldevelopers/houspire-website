'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function verifyAccess(formData) {
  const password = formData.get('password');
  // You can set the password in .env as SITE_ACCESS_PASSWORD
  const sitePassword = process.env.SITE_ACCESS_PASSWORD || 'houspire2026';
  
  if (password === sitePassword) {
    // Set cookie for 30 days
    const cookieStore = await cookies();
    cookieStore.set('site_pwd_auth', 'authenticated', {
      maxAge: 60 * 60 * 24 * 30,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      sameSite: 'lax',
    });
    
    // Redirect logic will be handled by the client to allow reading searchParams
    return { success: true };
  }
  
  return { success: false, error: 'Incorrect password' };
}

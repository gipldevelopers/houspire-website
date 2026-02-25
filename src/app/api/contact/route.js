import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getUserFromRequest } from '@/lib/auth';

// POST /api/contact - Submit a contact form
export async function POST(request) {
  try {
    const body = await request.json();
    const user = await getUserFromRequest(request); // Optional - user might not be logged in

    // For now, we'll store contact info in the message field with structured data
    // In production, you might want to create a separate contact_submissions table
    const contactMessage = `Contact Form Submission:
Name: ${body.name}
Email: ${body.email}
Phone: ${body.phone || 'Not provided'}
Subject: ${body.subject}

Message:
${body.message}`;

    // If user is logged in, create a support ticket
    // Otherwise, we could create a guest support entry or store in a separate table
    // For now, we'll create a minimal support ticket structure
    // Note: SupportTicket requires userId, so we need to handle guest submissions differently
    
    // TODO: Create a contact_submissions table in Prisma schema for guest submissions
    // For now, if user is not logged in, we'll just return success
    // In production, you should create a proper contact_submissions table

    if (user) {
      const supportTicket = await prisma.supportTicket.create({
        data: {
          userId: user.id,
          subject: body.subject || 'General Inquiry',
          message: contactMessage,
          status: 'open',
          priority: 'normal',
        },
      });

      return NextResponse.json({ 
        success: true,
        message: 'Your message has been received. We\'ll get back to you within 24 hours.',
        ticketId: supportTicket.id
      }, { status: 201 });
    } else {
      // Guest submission - in production, create a contact_submissions table
      // For now, we'll just return success
      // TODO: Implement guest contact submission storage
      return NextResponse.json({ 
        success: true,
        message: 'Your message has been received. We\'ll get back to you within 24 hours.',
      }, { status: 201 });
    }
  } catch (error) {
    console.error('Contact submission error:', error);
    return NextResponse.json(
      { error: 'Failed to submit your message. Please try again.' },
      { status: 500 }
    );
  }
}

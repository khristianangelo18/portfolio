import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';
import { z } from 'zod';

// Server-side validation schema (Matches your page.js)
const contactSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(5),
  message: z.string().min(10),
});

export async function POST(request) {
  try {
    const body = await request.json();
    
    // 1. Validate the data coming from the frontend
    const result = contactSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json(
        { error: 'Invalid form data' },
        { status: 400 }
      );
    }

    const { name, email, subject, message } = result.data;

    // 2. Setup Transporter (Gmail App Password logic)
    // Make sure to add EMAIL_USER and EMAIL_PASS in your Vercel Environment Variables
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    // 3. Configure Email Content
    const mailOptions = {
      from: email,
      to: process.env.EMAIL_USER, // Sends the email TO yourself
      replyTo: email, // When you click 'Reply', it goes to the user
      subject: `Portfolio Contact: ${subject} from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #333;">
          <h2 style="color: #3b82f6; border-bottom: 2px solid #eee; padding-bottom: 10px;">
            New Contact Form Submission
          </h2>
          <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0; border: 1px solid #edf2f7;">
            <p style="margin: 5px 0;"><strong>From:</strong> ${name}</p>
            <p style="margin: 5px 0;"><strong>Email:</strong> ${email}</p>
            <p style="margin: 5px 0;"><strong>Subject:</strong> ${subject}</p>
          </div>
          <div style="margin: 20px 0; line-height: 1.6;">
            <p><strong>Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: #fff; padding: 15px; border-left: 4px solid #3b82f6;">
              ${message}
            </p>
          </div>
          <footer style="font-size: 12px; color: #a0aec0; margin-top: 30px; text-align: center;">
            Sent from your Portfolio Website
          </footer>
        </div>
      `
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { success: true, message: 'Email sent successfully!' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Nodemailer Error:', error);
    return NextResponse.json(
      { error: 'Failed to send email. Please try again.' },
      { status: 500 }
    );
  }
}
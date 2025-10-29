// app/api/send-email/route.js
import { NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request) {
  try {
    const { name, email, subject, message } = await request.json();

    // Konfigurasi transporter Gmail
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.GMAIL_USER, // cekhealthv1@gmail.com
        pass: process.env.GMAIL_APP_PASSWORD, // App Password dari Gmail
      },
    });

    // Konfigurasi email
    const mailOptions = {
      from: email,
      to: 'cekhealthv1@gmail.com',
      subject: `Contact Form: ${subject}`,
      html: `
        <h2>Pesan Baru dari Contact Form</h2>
        <p><strong>Nama:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Subjek:</strong> ${subject}</p>
        <p><strong>Pesan:</strong></p>
        <p>${message}</p>
        <hr>
        <p><small>Dikirim dari CekHealth Contact Form</small></p>
      `,
    };

    // Kirim email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: 'Email sent successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error sending email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
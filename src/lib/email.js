import nodemailer from 'nodemailer';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: "localhost",
  port: 1025, // Default MailHog port
  secure: false,
  tls: {
    rejectUnauthorized: false
  }
});

export async function sendContactEmail(submission) {
  try {
    await transporter.sendMail({
      from: 'website@example.com',
      to: 'your-email@example.com', // Replace with your email
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${submission.name}</p>
        <p><strong>Email:</strong> ${submission.email}</p>
        <p><strong>Message:</strong> ${submission.message}</p>
      `
    });
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    return false;
  }
}
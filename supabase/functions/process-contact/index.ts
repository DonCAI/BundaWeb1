import { createClient } from 'npm:@supabase/supabase-js@2.39.0'
import { Resend } from 'npm:resend@2.0.0'

const resend = new Resend(Deno.env.get('RESEND_API_KEY'));

const supabase = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
);

Deno.serve(async (req) => {
  try {
    const { record } = await req.json();

    // Send email
    await resend.emails.send({
      from: 'noreply@yourdomain.com',
      to: 'your-email@example.com', // Replace with your email
      subject: 'New Contact Form Submission',
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${record.name}</p>
        <p><strong>Email:</strong> ${record.email}</p>
        <p><strong>Message:</strong> ${record.message}</p>
      `
    });

    // Update submission status
    await supabase
      .from('contact_submissions')
      .update({ status: 'sent' })
      .eq('id', record.id);

    return new Response(
      JSON.stringify({ message: 'Email sent successfully' }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
});
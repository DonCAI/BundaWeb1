import db from '../../lib/db.js';
import { sendContactEmail } from '../../lib/email.js';

export async function post({ request }) {
  try {
    const formData = await request.formData();
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');

    // Insert into SQLite database
    const stmt = db.prepare('INSERT INTO contact_submissions (name, email, message) VALUES (?, ?, ?)');
    const result = stmt.run(name, email, message);

    // Send email notification
    await sendContactEmail({ name, email, message });

    return new Response(JSON.stringify({
      message: "Děkujeme za vaši zprávu. Brzy se vám ozveme!"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error('Error processing form:', error);
    return new Response(JSON.stringify({
      message: "Omlouváme se, došlo k chybě. Zkuste to prosím později."
    }), {
      status: 500,
      headers: {
        "Content-Type": "application/json"
      }
    });
  }
}
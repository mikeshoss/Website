interface Env {
  CONTACT_EMAIL?: string;
  SENDGRID_API_KEY?: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://mikeshoss.com',
  };

  try {
    const formData = await request.formData();
    const name = formData.get('name')?.toString().trim();
    const email = formData.get('email')?.toString().trim();
    const message = formData.get('message')?.toString().trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required.' }),
        { status: 400, headers }
      );
    }

    // Basic email validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers }
      );
    }

    // If SendGrid is configured, send email
    if (env.SENDGRID_API_KEY && env.CONTACT_EMAIL) {
      const sgResponse = await fetch('https://api.sendgrid.com/v3/mail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${env.SENDGRID_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          personalizations: [{ to: [{ email: env.CONTACT_EMAIL }] }],
          from: { email: 'noreply@mikeshoss.com', name: 'mikeshoss.com Contact Form' },
          reply_to: { email, name },
          subject: `Contact form: ${name}`,
          content: [
            {
              type: 'text/plain',
              value: `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`,
            },
          ],
        }),
      });

      if (!sgResponse.ok) {
        return new Response(
          JSON.stringify({ error: 'Failed to send message. Please try again.' }),
          { status: 500, headers }
        );
      }
    }

    // Return success (even without SendGrid configured, for testing)
    return new Response(
      JSON.stringify({ success: true, message: 'Message sent successfully.' }),
      { status: 200, headers }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers }
    );
  }
};

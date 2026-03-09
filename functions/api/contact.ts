interface Env {
  AIRTABLE_BASE_ID: string;
  AIRTABLE_TABLE_NAME: string;
  AIRTABLE_TOKEN: string;
}

function getCorsOrigin(request: Request): string {
  const origin = request.headers.get('Origin') || '';
  const allowed = ['https://mikeshoss.com', 'http://localhost:8788', 'http://localhost:4321'];
  return allowed.includes(origin) ? origin : 'https://mikeshoss.com';
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const corsOrigin = getCorsOrigin(request);
  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': corsOrigin,
  };

  try {
    const body = await request.json() as { fields?: { Name?: string; Email?: string; Message?: string } };
    const name = body.fields?.Name?.trim();
    const email = body.fields?.Email?.trim();
    const message = body.fields?.Message?.trim();

    if (!name || !email || !message) {
      return new Response(
        JSON.stringify({ error: 'All fields are required.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Invalid email address.' }),
        { status: 400, headers: corsHeaders }
      );
    }

    if (!env.AIRTABLE_BASE_ID || !env.AIRTABLE_TABLE_NAME || !env.AIRTABLE_TOKEN) {
      return new Response(
        JSON.stringify({ error: 'Server configuration error. Check environment variables.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const airtableUrl = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}`;

    const url = new URL(request.url);
    const isLocal = url.hostname === 'localhost' || url.hostname === '127.0.0.1';

    const airtableRes = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        typecast: true,
        fields: {
          Name: name,
          Email: email,
          Message: message,
          Env: isLocal ? 'local' : 'production',
        },
      }),
    });

    if (!airtableRes.ok) {
      const airtableError = await airtableRes.text();
      console.error('Airtable error:', airtableRes.status, airtableError);
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try again.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch (err) {
    console.error('Contact function error:', err);
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: corsHeaders }
    );
  }
};

export const onRequestOptions: PagesFunction = async (context) => {
  const corsOrigin = getCorsOrigin(context.request);
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': corsOrigin,
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

interface Env {
  AIRTABLE_BASE_ID: string;
  AIRTABLE_TABLE_NAME: string;
  AIRTABLE_TOKEN: string;
}

export const onRequestPost: PagesFunction<Env> = async (context) => {
  const { request, env } = context;

  const corsHeaders = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': 'https://mikeshoss.com',
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
        JSON.stringify({ error: 'Server configuration error.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    const airtableUrl = `https://api.airtable.com/v0/${env.AIRTABLE_BASE_ID}/${encodeURIComponent(env.AIRTABLE_TABLE_NAME)}`;

    const airtableRes = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.AIRTABLE_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        fields: { Name: name, Email: email, Message: message },
      }),
    });

    if (!airtableRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Failed to send message. Please try again.' }),
        { status: 500, headers: corsHeaders }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: corsHeaders }
    );
  } catch {
    return new Response(
      JSON.stringify({ error: 'Something went wrong. Please try again.' }),
      { status: 500, headers: corsHeaders }
    );
  }
};

export const onRequestOptions: PagesFunction = async () => {
  return new Response(null, {
    headers: {
      'Access-Control-Allow-Origin': 'https://mikeshoss.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
};

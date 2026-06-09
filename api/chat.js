import OpenAI from 'openai';

let openai;
function getClient() {
  if (!openai) {
    openai = new OpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: process.env.OPENROUTER_API_KEY,
      defaultHeaders: {
        'HTTP-Referer': 'https://legendengineers.co.za',
        'X-Title': 'Legend Engineers',
      },
    });
  }
  return openai;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  if (!process.env.OPENROUTER_API_KEY) {
    return res.status(503).json({ error: 'The AI assistant is not configured yet.' });
  }

  const { messages } = req.body || {};
  if (!Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array required' });
  }

  try {
    const completion = await getClient().chat.completions.create({
      model: 'anthropic/claude-3.5-haiku',
      messages: [
        {
          role: 'system',
          content:
            'You are a professional assistant for Legend Engineers, an engineering firm based in Mpumalanga, South Africa, operating under the Enerdge Group. The company specialises in Geotechnical Investigations, Civil Engineering, and Mechanical Engineering. Major clients include Eskom Holdings and Seriti Resources. Be concise, professional, and helpful. For quotes or site bookings, direct users to the booking and quote forms on the website.',
        },
        ...messages,
      ],
    });

    const reply =
      completion.choices[0]?.message?.content ??
      'I was unable to generate a response. Please try again.';
    res.status(200).json({ reply });
  } catch (err) {
    console.error('Chat error:', err.message);
    res.status(500).json({ error: 'AI service unavailable. Please try again shortly.' });
  }
}

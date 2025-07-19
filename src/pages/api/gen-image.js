// pages/api/gen-image.js
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();

  const { prompt } = req.body;
  if (!prompt) return res.status(400).json({ error: 'Missing prompt' });

  try {
    const openaiRes = await fetch('https://api.openai.com/v1/images/generations', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt,
        n: 1,
        size: '256x256',
        response_format: 'url',
      }),
    });

    const { data } = await openaiRes.json();
    const imageUrl = data?.[0]?.url;
    if (!imageUrl) throw new Error('No image returned');

    const imageBuffer = await fetch(imageUrl).then(r => r.arrayBuffer());

    const fileName = `ai-items/${encodeURIComponent(prompt)}.png`;
    await supabase.storage.from('item-images').upload(fileName, imageBuffer, {
      contentType: 'image/png',
      upsert: true,
    });

    const { data: publicUrlData } = supabase.storage.from('item-images').getPublicUrl(fileName);
    res.status(200).json({ url: publicUrlData.publicUrl });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: 'Image generation failed' });
  }
}


exports.handler = async (event, context) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  const apiKey = process.env.GOOGLE_TTS_API_KEY;
  if (!apiKey) {
    // Safe fallback: if API key is missing, frontend falls back to built-in TTS
    return { statusCode: 500, body: JSON.stringify({ error: 'Missing GOOGLE_TTS_API_KEY' }) };
  }

  try {
    const { text, languageCode, voiceName, speed, pitch } = JSON.parse(event.body);
    const url = `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`;

    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: { text: text },
        // Use selected WaveNet voice
        voice: { languageCode: languageCode, name: voiceName },
        // Process and apply speech rate slowing at the cloud level!
        audioConfig: { audioEncoding: 'MP3', speakingRate: speed, pitch: pitch }
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error?.message || 'Google Cloud TTS Error');
    }

    return { statusCode: 200, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ audioContent: data.audioContent }) };
  } catch (error) {
    console.error('TTS Synthesis Error:', error.message);
    return { statusCode: 500, body: JSON.stringify({ error: 'Internal Server Error', details: error.message }) };
  }
};
import { generateElevenLabsAudio } from '../lib/generateElevenLabsAudio.js';
import { uploadToR2 } from '../lib/uploadToR2.js';

export default async function handler(req, res) {
  const speechText = req.body?.SpeechResult || "Hi, what’s on your menu?";

  try {
    const gptResponse = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful restaurant assistant. Answer clearly and concisely about the menu." },
          { role: "user", content: speechText }
        ]
      })
    });

    const gptData = await gptResponse.json();

    const reply = gptData?.choices?.[0]?.message?.content || "Sorry, I couldn't generate a response";

    const audioBuffer = await generateElevenLabsAudio(reply);
    const filename = `response-${Date.now()}.mp3`;
    const audioUrl = await uploadToR2(filename, audioBuffer);

    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(`
      <Response>
        <Play>${audioUrl}</Play>
      </Response>
    `);
  } catch (err) {
    console.error("Error in Twilio handler:", err);
    res.status(500).send(`<Response><Say>There was an error generating a response.</Say></Response>`);
  }
}

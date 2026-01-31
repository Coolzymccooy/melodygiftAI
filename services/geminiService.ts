
import { GoogleGenAI, Type, Modality } from "@google/genai";
import { SurveyData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const generateLyrics = async (data: SurveyData) => {
  const prompt = `
    You are a professional songwriter and music producer. Write high-quality, catchy song lyrics for a ${data.genre} song.
    
    Context:
    - Recipient: ${data.recipientName}
    - Occasion: ${data.occasion}
    - Mood: ${data.mood}
    - Key Memories: ${data.memories}
    - Must-include: ${data.mustInclude}
    - Language: ${data.language}

    Song Structure:
    - [Intro] (Setting the beat and vibe)
    - [Verse 1] (Storytelling)
    - [Chorus] (The big emotional hook)
    - [Verse 2] (More specific details)
    - [Chorus]
    - [Bridge] (Musical peak)
    - [Outro] (Final fade out)

    Include ad-libs in parentheses like (Ooh yeah), (Check it), or (For you, ${data.recipientName}).
    Ensure the rhyme scheme fits ${data.genre} perfectly.

    Return JSON with 'title' and 'lyrics'.
  `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          title: { type: Type.STRING },
          lyrics: { type: Type.STRING }
        },
        required: ["title", "lyrics"]
      }
    }
  });

  return JSON.parse(response.text);
};

export const generateSongAudio = async (lyrics: string, genre: string, mood: string) => {
  // Using the stable preview-tts model which supports expressive performance
  const prompt = `
    PERFORM THIS AS A COMPLETE MUSICAL TRACK. 
    You are a professional recording artist. This is a ${genre} song with a ${mood} vibe.
    
    CRITICAL INSTRUCTIONS FOR MUSIC PRODUCTION:
    1. VOCAL PERCUSSION: You MUST provide your own rhythmic background. Start with a 5-second vocal beat (e.g., "boom-shak-a-lak-a-boom") to set the tempo.
    2. MELODIC DELIVERY: Do NOT read. You must SING or FLOW with the musical cadence of ${genre}. 
    3. BEAT MAINTENANCE: Keep a steady rhythmic pulse with your voice (like a human beatboxer) underneath your singing.
    4. ENERGY SHIFTS: Make the [Chorus] parts sound more melodic and high-energy than the [Verse] parts.
    5. INSTRUMENTAL ACCENTS: Use vocal sounds to represent instrumental stabs (e.g., "skrrt-skrrt" for drill, soulful hums for gospel).

    Lyrics to record:
    ${lyrics.substring(0, 1000)}
  `;
  
  const response = await ai.models.generateContent({
    model: "gemini-2.5-flash-preview-tts",
    contents: [{ parts: [{ text: prompt }] }],
    config: {
      responseModalities: [Modality.AUDIO],
      speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { 
              voiceName: genre === 'R&B' || genre === 'Amapiano' ? 'Kore' : 
                         genre === 'UK Drill' ? 'Fenrir' : 
                         genre === 'Gospel' ? 'Puck' : 'Zephyr' 
            },
          },
      },
    },
  });

  return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
};

export const generateAlbumArt = async (title: string, genre: string, mood: string) => {
  const prompt = `A professional album cover for a song titled "${title}". Genre: ${genre}, Mood: ${mood}. Cinematic lighting, 8k render, artistic, minimalist, no text.`;
  
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: { parts: [{ text: prompt }] },
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:image/png;base64,${part.inlineData.data}`;
    }
  }
  return `https://picsum.photos/seed/${encodeURIComponent(title)}/800/800`;
};

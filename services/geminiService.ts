
import { GoogleGenAI, Type } from "@google/genai";
import { DecodedText } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

export const decodeText = async (text: string): Promise<DecodedText> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Analyze the following English text to assist a non-native speaker with "symbol decoding". 
    Identify parts of speech, break down the syntactic skeleton (Subject-Verb-Object), and highlight common phrases.
    
    TEXT: "${text}"`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          sentences: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                original: { type: Type.STRING },
                tokens: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      text: { type: Type.STRING },
                      pos: { type: Type.STRING, enum: ['noun', 'verb', 'adjective', 'adverb', 'preposition', 'conjunction', 'other'] },
                      explanation: { type: Type.STRING },
                      isPhrase: { type: Type.BOOLEAN }
                    },
                    required: ['text', 'pos']
                  }
                },
                skeleton: {
                  type: Type.OBJECT,
                  properties: {
                    subject: { type: Type.STRING },
                    verb: { type: Type.STRING },
                    object: { type: Type.STRING }
                  },
                  required: ['subject', 'verb']
                },
                clauses: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING, enum: ['main', 'subordinate'] },
                      text: { type: Type.STRING }
                    }
                  }
                }
              },
              required: ['original', 'tokens', 'skeleton']
            }
          }
        },
        required: ['sentences']
      }
    }
  });

  return JSON.parse(response.text || '{"sentences": []}');
};

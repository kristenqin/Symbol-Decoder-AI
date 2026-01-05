
import { GoogleGenAI, Type } from "@google/genai";
import { DecodedText, PartOfSpeech } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

const POS_MAP: Record<string, PartOfSpeech> = {
  'n': PartOfSpeech.NOUN,
  'v': PartOfSpeech.VERB,
  'j': PartOfSpeech.ADJECTIVE,
  'a': PartOfSpeech.ADVERB,
  'p': PartOfSpeech.PREPOSITION,
  'c': PartOfSpeech.CONJUNCTION,
  'o': PartOfSpeech.OTHER
};

/**
 * Hyper-compact Token: [text, pos_char, optional_exp, optional_is_phrase_bool]
 * Example: ["Manatees", "n", "Sea cows", 0]
 */
type CompactToken = [string, string, string?, number?];

export const decodeText = async (text: string): Promise<DecodedText> => {
  const response = await ai.models.generateContent({
    model: 'gemini-3-pro-preview',
    contents: `Analyze this English text. Reconstruct the full content.
    Return JSON with a single key "s" containing an array of sentence objects.
    Each sentence object: {"o": "original text", "tk": [[token_data]], "sk": ["subj", "verb", "obj"]}.
    Token data: ["text", "pos_char", "brief_exp", is_phrase_0_or_1].
    POS chars: n:noun, v:verb, j:adj, a:adv, p:prep, c:conj, o:other.
    
    TEXT: "${text.replace(/"/g, '\\"')}"`,
    config: {
      responseMimeType: "application/json",
      maxOutputTokens: 8192,
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          s: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                o: { type: Type.STRING },
                tk: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.ARRAY,
                    items: { type: Type.STRING } // Using string for mixed type to satisfy schema
                  }
                },
                sk: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ['o', 'tk', 'sk']
            }
          }
        },
        required: ['s']
      }
    }
  });

  let jsonStr = (response.text || "").trim();
  
  // Resilient JSON closure for truncated responses
  const fixJson = (str: string) => {
    let result = str;
    // Remove trailing commas before closing
    result = result.replace(/,\s*([\]}])/g, '$1');
    result = result.replace(/,\s*$/, '');
    
    const count = (char: string) => (result.match(new RegExp('\\' + char, 'g')) || []).length;
    
    const missingBrackets = count('[') - count(']');
    const missingCurlies = count('{') - count('}');
    
    // If it ends mid-token array or mid-object
    if (result.endsWith('"') || result.match(/[0-9]$/)) {
        // We are likely inside an array or object
    }

    result += "]".repeat(Math.max(0, missingBrackets));
    result += "}".repeat(Math.max(0, missingCurlies));
    
    return result;
  };

  try {
    const cleanedJson = fixJson(jsonStr);
    const data = JSON.parse(cleanedJson);
    
    return {
      sentences: (data.s || []).map((s: any) => ({
        original: s.o || "",
        tokens: (s.tk || []).map((t: any[]) => ({
          text: String(t[0] || ""),
          pos: POS_MAP[t[1]] || PartOfSpeech.OTHER,
          explanation: t[2] || undefined,
          isPhrase: !!t[3]
        })),
        skeleton: {
          subject: (s.sk || [])[0] || "",
          verb: (s.sk || [])[1] || "",
          object: (s.sk || [])[2] || undefined
        }
      }))
    };
  } catch (e) {
    console.error("Parse Error. Raw:", jsonStr);
    throw new Error("The content length exceeded the AI's single-pass capacity. Please process smaller sections (e.g., 2-3 paragraphs at a time).");
  }
};

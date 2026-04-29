"use server";
import { put } from "@vercel/blob";
import { generateText } from "ai";
import { google } from "@ai-sdk/google"; // 1. Import the provider
import { z } from "zod"; // Ensure zod is imported for tools

// 2. Define the actual model instance
const myModel = google("gemini-1.5-pro-latest"); 

export async function processRLM(query: string, context: string) {
  // Store large context in Vercel Blob
  const { url } = await put("context.txt", context, { 
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN 
  });

  const result = await generateText({
    model: myModel, // Now 'myModel' is defined!
    system: `You are an RLM. You have a long context at ${url}. 
             If you need specific data, call the 'subQuery' tool.`,
    prompt: query,
    tools: {
      subQuery: {
        description: "Fetch a specific chunk of the context",
        parameters: z.object({ 
          start: z.number(), 
          end: z.number() 
        }),
        execute: async ({ start, end }) => {
          const response = await fetch(url, { 
            headers: { Range: `bytes=${start}-${end}` } 
          });
          return res.text();
        }
      }
    }
  });

  return result.text;
}
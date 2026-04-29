"use server";
import { put } from "@vercel/blob";
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const myModel = google("gemini-1.5-pro-latest"); 

export async function processRLM(query: string, context: string) {
  const { url } = await put("context.txt", context, { 
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN 
  });

  const result = await generateText({
    model: myModel,
    system: `You are an RLM. Use 'subQuery' to fetch context chunks from ${url}.`,
    prompt: query,
    tools: {
      subQuery: tool({
        description: "Fetch a specific chunk of the context",
        parameters: z.object({ 
          start: z.number(), 
          end: z.number() 
        }),
        // Explicitly type the parameters here to satisfy the TS overload
        execute: async ({ start, end }: { start: number; end: number }) => {
          const response = await fetch(url, { 
            headers: { Range: `bytes=${start}-${end}` } 
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch chunk: ${response.statusText}`);
          }
          
          return response.text();
        }
      })
    }
  });

  return result.text;
}
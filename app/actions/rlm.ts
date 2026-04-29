"use server";
import { put } from "@vercel/blob";
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const myModel = google("gemini-2.5-flash");

export async function processRLM(query: string, context: string) {
  // 1. Upload the context with a random suffix to avoid "already exists" errors
  const { url } = await put("processed_context.txt", context, {
    access: "public",
    addRandomSuffix: true, 
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  // 2. Execute the generative model
  const result = await generateText({
    model: myModel,
    system: `You are an RLM. Use 'subQuery' to fetch context chunks from ${url}.`,
    prompt: query,
    tools: {
      subQuery: tool({
        description: "Fetch a specific chunk of the context",
        inputSchema: z.object({
          start: z.number().describe("The starting byte index"),
          end: z.number().describe("The ending byte index"),
        }),
        execute: async ({ start, end }) => {
          const response = await fetch(url, {
            headers: { Range: `bytes=${start}-${end}` },
          });
          
          if (!response.ok) {
            throw new Error(`Failed to fetch range: ${response.statusText}`);
          }
          
          return response.text();
        },
      }),
    },
  });

  return result.text;
}
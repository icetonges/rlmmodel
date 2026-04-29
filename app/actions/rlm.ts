"use server";
import { put } from "@vercel/blob";
import { generateText, tool } from "ai";
import { google } from "@ai-sdk/google";
import { z } from "zod";

const myModel = google("gemini-1.5-pro-latest");

export async function processRLM(query: string, context: string) {
  const { url } = await put("context.txt", context, {
    access: "public",
    token: process.env.BLOB_READ_WRITE_TOKEN,
  });

  const result = await generateText({
    model: myModel,
    system: `You are an RLM. Use 'subQuery' to fetch context chunks from ${url}.`,
    prompt: query,
    tools: {
      subQuery: tool({
        description: "Fetch a specific chunk of the context",
        // FIX: Change 'parameters' to 'inputSchema'
        inputSchema: z.object({
          start: z.number().describe("The starting byte index"),
          end: z.number().describe("The ending byte index"),
        }),
        execute: async ({ start, end }) => {
          const response = await fetch(url, {
            headers: { Range: `bytes=${start}-${end}` },
          });
          return response.text();
        },
      }),
    },
  });

  return result.text;
}
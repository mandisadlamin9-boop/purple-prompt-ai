import { createServerFn } from "@tanstack/react-start";
import { streamText } from "ai";
import { z } from "zod";
import { AI_MODEL, createLovableAiGatewayProvider } from "./ai-gateway.server";

function gateway() {
  const key = process.env["LOVABLE_API_KEY"];
  if (!key) throw new Error("AI is not configured. Missing API key.");
  return createLovableAiGatewayProvider(key);
}

async function run(system: string, prompt: string) {
  try {
    const result = streamText({
      model: gateway()(AI_MODEL),
      system,
      prompt,
    });
    return { text: await result.text };
  } catch (error) {
    const status = (error as { statusCode?: number; status?: number })?.statusCode ??
      (error as { status?: number })?.status;
    if (status === 429) {
      throw new Error("Too many requests right now. Please wait a moment and try again.");
    }
    if (status === 402) {
      throw new Error("AI credits are exhausted. Please add credits to continue.");
    }
    throw new Error(
      error instanceof Error ? error.message : "The AI request failed. Please try again.",
    );
  }
}

const EmailInput = z.object({
  recipient: z.string().max(200).optional().default(""),
  subject: z.string().max(300).optional().default(""),
  purpose: z.string().min(1).max(4000),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  length: z.enum(["Short", "Medium", "Detailed"]).default("Medium"),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You are an expert workplace communication assistant. You write clear, professional emails. Return only the email: a Subject line, then the body with a greeting, well structured paragraphs and a sign off. Use plain text, no markdown code fences, no commentary.",
      [
        `Tone: ${data.tone}`,
        `Length: ${data.length}`,
        data.recipient ? `Recipient: ${data.recipient}` : "Recipient: unspecified",
        data.subject ? `Suggested subject: ${data.subject}` : "",
        `Purpose and key points:\n${data.purpose}`,
      ]
        .filter(Boolean)
        .join("\n"),
    ),
  );

const NotesInput = z.object({
  notes: z.string().min(1).max(20000),
  meetingTitle: z.string().max(300).optional().default(""),
});

export const summarizeNotes = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => NotesInput.parse(input))
  .handler(async ({ data }) =>
    run(
      "You are a meeting notes analyst. Summarize meeting notes into markdown with exactly these sections: '## Summary' (3-5 bullets), '## Key Decisions', '## Action Items' (each as '- [Owner] task — due date if mentioned'), '## Deadlines', '## Open Questions'. If a section has no content, write '- None identified'. Never invent facts.",
      [
        data.meetingTitle ? `Meeting: ${data.meetingTitle}` : "",
        `Notes:\n${data.notes}`,
      ]
        .filter(Boolean)
        .join("\n\n"),
    ),
  );

const ChatInput = z.object({
  messages: z.array(
    z.object({
      role: z.enum(["user", "assistant"]),
      content: z.string().max(8000),
    }),
  ),
});

export const chatWithAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    try {
      const result = streamText({
        model: gateway()(AI_MODEL),
        system:
          "You are Aura, a helpful AI workplace productivity assistant. You help with emails, meetings, planning, prioritisation, documents and workplace communication. Be concise, practical and friendly. Use markdown formatting with short paragraphs and bullet lists where useful.",
        messages: data.messages,
      });
      return { text: await result.text };
    } catch (error) {
      throw new Error(
        error instanceof Error ? error.message : "The AI request failed. Please try again.",
      );
    }
  });

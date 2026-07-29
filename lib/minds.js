import { createMindsClient } from "@animocabrands/minds-client-lib";

const apiKey = process.env.MINDS_BUILDER_API_KEY;
const mindId = process.env.MINDS_MIND_ID;
const alias = process.env.MINDS_CONVERSATION_ALIAS || "replynest-community";

function toPlainText(value) {
  return value
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function configured() {
  return Boolean(apiKey && mindId);
}

export function mindsConfigured() {
  return configured();
}

/**
 * ReplyNest deliberately routes every decision through the same conversation alias.
 * That stable alias is the product's persistence layer: the Mind keeps its long-term
 * memory and can resume member care across requests, sessions, and daily automations.
 */
export async function askMind(messageText) {
  if (!configured()) throw new Error("Minds credentials are not configured.");

  const client = createMindsClient({ builderApiKey: apiKey });
  await client.ensureConversation(alias, mindId);
  const before = await client.getLatestHistoryFingerprint(alias);
  await client.sendMessage({ alias, messageText });
  const outcome = await client.waitForReply({
    alias,
    afterFingerprint: before,
    sentMessageText: messageText,
    timeoutMs: 90_000
  });

  if (outcome.timedOut || !outcome.reply?.messageText) {
    throw new Error("Echo did not reply in time.");
  }
  return toPlainText(outcome.reply.messageText);
}

/**
 * A human-readable proof that Echo is using a single durable conversation.
 * Technical prompts are intentionally summarized so demos do not expose them.
 */
export async function getMemoryTrail() {
  if (!configured()) throw new Error("Minds credentials are not configured.");

  const client = createMindsClient({ builderApiKey: apiKey });
  await client.ensureConversation(alias, mindId);
  const history = await client.getHistory(alias, { limit: 8 });

  return history
    .slice()
    .reverse()
    .map((row) => {
      const text = toPlainText(row.messageText || "");
      const isMind = row.senderType === 0;
      return {
        kind: isMind ? "Echo replied" : "Creator context saved",
        text: isMind
          ? text.slice(0, 220)
          : "Echo received member context and a care goal for this conversation."
      };
    })
    .filter((event) => event.text);
}

export function draftFallback(post) {
  if (post.author === "Leo Park") {
    return "I’m sorry that link has been a hassle, Leo — thanks for flagging it again. I’ve marked this as a priority so we can get you back to the member resources without more digging.";
  }
  if (post.author === "Nia Woods") {
    return "Nia, that is wonderful to hear — congratulations on getting your first challenge post out! I’m cheering you on, and I’d love to hear how the next attempt feels once you’ve had a little space to reflect.";
  }
  return "Maya, I’m so glad the storyboard breakdown was useful. A 30-second reel template would be a great next step — I’ll make sure your question is included as we shape the next creator resource.";
}

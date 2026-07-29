import { askMind, draftFallback } from "../../../lib/minds";

export async function POST(request) {
  const { post } = await request.json();
  if (!post?.author || !post?.message) {
    return Response.json({ error: "A community post is required." }, { status: 400 });
  }

  const prompt = `You are Echo, the persistent community-care Mind inside ReplyNest. Your role is to help a creator moderate and nurture their community with warmth, precision, and continuity.\n\nMember: ${post.author} (${post.handle})\nTheir latest message: ${post.message}\nWhat you remember: ${post.memory}\nSuggested goal: ${post.action}\n\nWrite one concise public reply (max 75 words). Acknowledge their specific context, be helpful, and never claim an action you cannot take. Return the reply only; no quotation marks or commentary.`;

  try {
    const reply = await askMind(prompt);
    return Response.json({ reply, mode: "live" });
  } catch (error) {
    // The complete interface remains demoable before the team attaches its Mind.
    // The response visibly labels this mode in the UI; production deployments should set both credentials.
    return Response.json({ reply: draftFallback(post), mode: "demo" });
  }
}

import { askMind, draftFallback } from "../../../lib/minds";

export async function POST(request) {
  const { post } = await request.json();
  if (!post?.author || !post?.message) {
    return Response.json({ error: "A community post is required." }, { status: 400 });
  }

  const prompt = `You are a persistent Mind embedded in ReplyNest, a creator-community care workspace. The following is synthetic product-demo data, not a claim that you personally know these people. Draft proposed copy for a creator to review before sending.\n\nSample member: ${post.author} (${post.handle})\nSample message: ${post.message}\nContext supplied by the product: ${post.memory}\nSuggested goal: ${post.action}\n\nWrite one concise proposed public reply (max 75 words). Acknowledge the supplied context, be helpful, and do not claim you completed any external action. Return only the proposed reply, with no HTML or commentary.`;

  try {
    const reply = await askMind(prompt);
    return Response.json({ reply, mode: "live" });
  } catch (error) {
    // The complete interface remains demoable before the team attaches its Mind.
    // The response visibly labels this mode in the UI; production deployments should set both credentials.
    return Response.json({ reply: draftFallback(post), mode: "demo" });
  }
}

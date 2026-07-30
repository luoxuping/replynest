import { askMind } from "../../../lib/minds";

const scheduledQueue = [
  {
    author: "Leo Park",
    message: "The member link in the latest newsletter gives me a 404. I've tried twice.",
    memory: "Paid member for 8 months. Previously helped troubleshoot the Discord onboarding.",
    status: "Needs review"
  }
];

async function createAutopilotSummary(posts) {
  const pending = posts.filter((post) => post.status !== "Approved").map((post) => `- ${post.author}: ${post.message} (memory: ${post.memory})`).join("\n");
  const prompt = `You are a persistent Mind embedded in ReplyNest. The following is synthetic product-demo data. Review the sample queue and propose the one most important creator follow-up for today. Explain in one short sentence why it matters and what should happen next. Do not imply you already performed an external action.\n\n${pending}`;

  try {
    const summary = await askMind(prompt);
    return { summary: `Echo's daily follow-up: ${summary}`, mode: "live" };
  } catch {
    return { summary: "Echo's daily follow-up: Leo's broken member link should be addressed first; he is a long-term paying member and the issue remains unresolved across sessions.", mode: "demo" };
  }
}

export async function POST(request) {
  const { posts = [] } = await request.json();
  return Response.json(await createAutopilotSummary(posts));
}

// Vercel Cron invokes this route with GET. A secret prevents arbitrary callers
// from spending the Mind's cognition credits on autonomous runs.
export async function GET(request) {
  const secret = process.env.CRON_SECRET;
  const authorized = secret && request.headers.get("authorization") === `Bearer ${secret}`;
  if (!authorized) return Response.json({ error: "Unauthorized cron request." }, { status: 401 });
  return Response.json(await createAutopilotSummary(scheduledQueue));
}

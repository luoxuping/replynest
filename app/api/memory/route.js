import { getMemoryTrail } from "../../../lib/minds";

const demoTrail = [
  { kind: "Creator context saved", text: "Maya asked about short-form workflow and saved the lighting checklist." },
  { kind: "Echo replied", text: "Echo prepared a 30-second reel structure that uses Maya's existing lighting checklist." },
  { kind: "Creator context saved", text: "Leo's member-link issue remained unresolved after the previous session." },
  { kind: "Echo replied", text: "Echo elevated Leo's issue as the first proactive follow-up for today." }
];

export async function GET() {
  try {
    return Response.json({ mode: "live", events: await getMemoryTrail() });
  } catch {
    return Response.json({ mode: "demo", events: demoTrail });
  }
}

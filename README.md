# ReplyNest

**A persistent community-care Mind for creators.** Built for the Creative Minds Jam #1 — *Moderation & community assistance* track.

ReplyNest uses a [Minds by Animoca Brands](https://build.hellominds.ai) agent as its core decision-maker. It preserves a single conversation alias across requests, so the Mind can retain member context, resume unresolved care, and provide proactive daily follow-ups.

The built-in showcase uses synthetic creator-community records. The UI labels every Mind output as a creator-reviewable proposal; it never claims that a Mind knows a person or took an external action without real source data and an approved integration.

## Why it fits the brief

| Jam requirement | ReplyNest implementation |
| --- | --- |
| Persistent Mind agent | All decisions go through a configured Mind with `ensureConversation(alias, mindId)`. |
| Memory | The Mind sees historical context through the same stable conversation, while the UI makes remembered member context visible. |
| Continuity | A member's unresolved issue is included in the next care decision, even after a new browser session. |
| Autonomous follow-up | `/api/autopilot` sends the care queue to the Mind; `vercel.json` schedules it every day at 09:00 UTC. |
| Creator-economy problem | Creators can care for a growing community without treating loyal members like anonymous tickets. |

## Run locally

Requires Node 22+.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The interface works in clearly-labelled demo mode before credentials are added. To make every draft and follow-up come from a live Mind:

1. Create a Mind and a Builder API key from the [Minds Builder account setup](https://build.hellominds.ai/docs/get-started/account-setup).
2. Add `MINDS_BUILDER_API_KEY` and `MINDS_MIND_ID` to `.env.local`.
3. Restart the development server.

Never put the Builder API key in a `NEXT_PUBLIC_*` variable or the browser: it is used only by server routes.

For deployment, add a random `CRON_SECRET` to your host's environment variables. Vercel uses it to authenticate the scheduled `GET /api/autopilot` invocation, preventing arbitrary requests from spending the Mind's Cognition Credits.

## Suggested Mind DNA

When creating the Mind, tell the Concierge:

> You are Echo, ReplyNest's community-care agent for independent creators. You remember community members as people, prioritize unresolved harm and access issues, write warm and concise replies, and proactively surface one meaningful follow-up each day. Never promise an action you cannot execute, never expose private member information, and ask for creator approval before any public reply is sent.

## Demo script (1.5–2 min)

1. Start on the dashboard: introduce Echo as a community Mind that is always on.
2. Select Maya: show the visible remembered context, then choose **Draft with Echo**.
3. Refresh the page or select Leo: explain that Echo retains the same conversation alias and can resume the broken-link issue.
4. Click **Show persistent memory proof**: show the live Minds conversation trail — not a mocked activity log.
5. Click **Run daily follow-up**: show Echo prioritizing Leo without another user prompt.
6. Close on the three proof points: long-term memory, cross-session continuity, and autonomous daily follow-up.

## Demo video

[`demo/ReplyNest-Demo.mp4`](demo/ReplyNest-Demo.mp4) is a 99.9-second, 720p English-narrated walkthrough of the product and its Minds integration.

## Submission checklist

- [ ] Register for Creative Minds Jam #1 on DoraHacks
- [ ] Add a live Mind + Builder API key
- [ ] Record the demo after verifying a live reply
- [ ] Push this repository to GitHub
- [ ] Add the public repository and 1.5–2 minute video to the DoraHacks BUIDL submission

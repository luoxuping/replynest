# ReplyNest — submission copy

## Tagline

**A persistent community Mind that helps creators remember the people behind every comment.**

## The problem

Independent creators are expected to grow a community, moderate it, answer members, and retain loyal supporters — often alone. Existing moderation products treat each message as an isolated ticket. That makes a long-time member repeat their history and lets small unresolved issues quietly erode trust.

## The solution

ReplyNest is a community-care workspace powered by **Echo**, a Minds by Animoca Brands agent. Echo sees a creator's care queue, remembers relevant member context through a stable Minds conversation, drafts warm and contextual replies, and proactively selects the one follow-up that needs attention each day.

Creators remain in control: Echo proposes and drafts; a human approves the public reply.

## Minds integration

Minds is the product core, not an optional chatbot:

- Every ReplyNest decision calls `ensureConversation("replynest-community", mindId)` before messaging. The stable alias binds all care events to one persistent Mind conversation.
- Echo receives the member's current message, the remembered context, and the care goal, then produces the reply shown in the approval queue.
- The daily `/api/autopilot` route asks Echo to identify the most important unresolved follow-up. It is scheduled once daily in production.
- The Mind's persistent history gives the next session continuity, rather than starting from a blank chat each time.

## Track

**Moderation & community assistance** — ReplyNest helps creators maintain a warm, contextual community without flattening people into anonymous messages.

## Technical stack

Next.js 15, React 19, and `@animocabrands/minds-client-lib`. The Builder API key is server-only and never exposed to the browser.

## Demo walkthrough

1. Show the care queue and choose Maya's question.
2. Show the memory: Echo knows Maya asked about short-form workflow in a previous session.
3. Click **Draft with Echo**. Echo provides a context-aware reply for creator approval.
4. Switch to Leo. His unresolved member-link problem is prioritized because Echo remembers that he is a long-term paying member.
5. Click **Run daily follow-up** to show Echo's autonomous, daily continuity loop.

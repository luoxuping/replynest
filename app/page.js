"use client";

import { useEffect, useMemo, useState } from "react";

const initialPosts = [
  {
    id: "p1",
    author: "Maya Chen",
    handle: "@mayamakes",
    tone: "Question",
    message: "I loved last week's storyboard breakdown. Is there a template for planning a 30-second reel?",
    memory: "Asked about short-form workflow last week; saved the lighting checklist.",
    action: "Helpful reply",
    status: "Needs review"
  },
  {
    id: "p2",
    author: "Leo Park",
    handle: "@leopark",
    tone: "Frustrated",
    message: "The member link in the latest newsletter gives me a 404. I've tried twice.",
    memory: "Paid member for 8 months. Previously helped troubleshoot the Discord onboarding.",
    action: "Priority follow-up",
    status: "Needs review"
  },
  {
    id: "p3",
    author: "Nia Woods",
    handle: "@niawrites",
    tone: "Supportive",
    message: "The new challenge is so good. I posted my first attempt and tagged the community!",
    memory: "Joined the July challenge yesterday; prefers gentle encouragement over public spotlighting.",
    action: "Celebrate + check in",
    status: "Scheduled"
  }
];

function statusClass(status) {
  return status === "Scheduled" ? "scheduled" : status === "Approved" ? "approved" : "review";
}

export default function Home() {
  const [posts, setPosts] = useState(initialPosts);
  const [selectedId, setSelectedId] = useState("p1");
  const [reply, setReply] = useState("");
  const [loading, setLoading] = useState(false);
  const [notice, setNotice] = useState("");
  const [mindReady, setMindReady] = useState(false);
  const [memoryTrail, setMemoryTrail] = useState([]);
  const [memoryLoading, setMemoryLoading] = useState(false);
  const selected = useMemo(() => posts.find((post) => post.id === selectedId) ?? posts[0], [posts, selectedId]);
  const replayDemo = typeof window !== "undefined" && new URLSearchParams(window.location.search).get("demo") === "replay";

  useEffect(() => {
    fetch("/api/status")
      .then((response) => response.json())
      .then((data) => setMindReady(Boolean(data.mindsConfigured)))
      .catch(() => setMindReady(false));
  }, []);

  async function draftReply() {
    setLoading(true);
    setNotice("");
    try {
      if (replayDemo) {
        const reply = selected.id === "p2"
          ? "Thanks for flagging this again, Leo. I know you have already tried twice, so I am prioritizing the member link issue for a quick check and update."
          : "Maya, I am glad the storyboard breakdown helped. For a 30-second reel, start with a three-second hook, one clear story beat, and a final call to action — your lighting checklist will fit right into that flow.";
        setReply(reply);
        setNotice("Recorded demo replay — the production path uses the same persistent Minds conversation.");
        return;
      }
      const response = await fetch("/api/draft", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ post: selected })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "ReplyNest could not draft a response.");
      setReply(data.reply);
      setNotice(data.mode === "demo" ? "Demo draft shown — add Minds credentials to make a live Mind call." : "Drafted by your persistent Mind.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  function approveReply() {
    if (!reply.trim()) return;
    setPosts((current) => current.map((post) => post.id === selected.id ? { ...post, status: "Approved" } : post));
    setNotice("Reply approved and added to the creator's send queue.");
  }

  async function runAutopilot() {
    setLoading(true);
    setNotice("");
    try {
      if (replayDemo) {
        setNotice("Echo's daily follow-up: Leo's broken member link should be addressed first; he is a long-term member and the issue remains unresolved across sessions.");
        return;
      }
      const response = await fetch("/api/autopilot", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ posts })
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Autopilot did not finish.");
      setNotice(data.summary);
    } catch (error) {
      setNotice(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function showMemoryTrail() {
    setMemoryLoading(true);
    try {
      const response = await fetch("/api/memory");
      const data = await response.json();
      setMemoryTrail(data.events || []);
      setNotice(data.mode === "live" ? "This is Echo's real persistent conversation trail." : "Demo memory trail shown — connect a Mind to reveal live history.");
    } catch {
      setNotice("Memory history is unavailable right now.");
    } finally {
      setMemoryLoading(false);
    }
  }

  return (
    <main>
      <header className="topbar">
        <a className="brand" href="#top" aria-label="ReplyNest home"><span>✦</span> ReplyNest</a>
        <div className="mind-state"><i /> Persistent Mind connected <span className="demo-tag">{mindReady ? "live Mind" : "demo mode"}</span></div>
        <button className="ghost" onClick={runAutopilot} disabled={loading}>Run daily follow-up</button>
      </header>

      <section className="hero" id="top">
        <div>
          <p className="eyebrow">COMMUNITY CARE, WITH A MEMORY</p>
          <h1>Your community<br />should feel <em>remembered.</em></h1>
          <p className="lead">ReplyNest is a persistent community Mind for creators. It remembers context, continues unfinished care, and surfaces the next meaningful follow-up.</p>
        </div>
        <aside className="mind-card">
          <div className="mind-card-head"><span className="orb">✦</span><span><b>Echo</b><small>Your community Mind</small></span><span className="live">Always on</span></div>
          <p>“I noticed Leo's access issue is unresolved. I’ve put a warm, priority reply in your review queue.”</p>
          <div className="memory-line"><span>↻</span> 42 conversations remembered this week</div>
        </aside>
      </section>

      <section className="metrics" aria-label="Community activity">
        <div><small>MEMBERS REMEMBERED</small><strong>1,284</strong><span>+84 this month</span></div>
        <div><small>FOLLOW-UPS THIS WEEK</small><strong>18</strong><span>6 need your review</span></div>
        <div><small>COMMUNITY WARMTH</small><strong>94<span className="percent">%</span></strong><span>↑ 7% from last month</span></div>
      </section>

      <section className="workspace">
        <div className="queue-panel">
          <div className="section-title"><div><p className="eyebrow">TODAY'S CARE QUEUE</p><h2>Where Echo can help</h2></div><span className="queue-count">{posts.filter((post) => post.status === "Needs review").length} to review</span></div>
          <div className="post-list">
            {posts.map((post) => (
              <button key={post.id} className={`post ${selected.id === post.id ? "selected" : ""}`} onClick={() => { setSelectedId(post.id); setReply(""); setNotice(""); }}>
                <span className="avatar">{post.author.split(" ").map((word) => word[0]).join("")}</span>
                <span className="post-copy"><b>{post.author}</b><small>{post.handle} · {post.tone}</small><span>{post.message}</span></span>
                <span className={`status ${statusClass(post.status)}`}>{post.status}</span>
              </button>
            ))}
          </div>
        </div>

        <aside className="detail-panel">
          <p className="eyebrow">MEMBER CONTEXT</p>
          <div className="member-name"><span className="avatar large">{selected.author.split(" ").map((word) => word[0]).join("")}</span><div><h2>{selected.author}</h2><small>{selected.handle} · Community member</small></div></div>
          <div className="memory-box"><b><span>✦</span> What Echo remembers</b><p>{selected.memory}</p></div>
          <button className="memory-trigger" onClick={showMemoryTrail} disabled={memoryLoading}>{memoryLoading ? "Reading Echo's memory…" : "Show persistent memory proof"}</button>
          {memoryTrail.length > 0 && <div className="memory-trail" aria-label="Persistent Mind memory trail">
            {memoryTrail.slice(-4).map((event, index) => <div key={`${event.kind}-${index}`}><small>{event.kind}</small><p>{event.text}</p></div>)}
          </div>}
          <div className="recommended"><span>↗</span><div><small>RECOMMENDED NEXT STEP</small><b>{selected.action}</b></div></div>
          <button className="primary" onClick={draftReply} disabled={loading}>{loading ? "Echo is thinking…" : "Draft with Echo"}<span>→</span></button>
          {reply && <div className="draft"><div><small>ECHO'S DRAFT</small><button onClick={() => setReply("")}>×</button></div><textarea value={reply} onChange={(event) => setReply(event.target.value)} /><button className="approve" onClick={approveReply}>Approve reply</button></div>}
          {notice && <p className="notice" role="status">{notice}</p>}
        </aside>
      </section>

      <section className="proof">
        <span className="orb">✦</span><div><p className="eyebrow">BUILT FOR CREATIVE MINDS JAM</p><h2>Not a chatbot. A community relationship that continues.</h2></div><div className="proof-points"><span>✓ Long-term member memory</span><span>✓ Cross-session continuity</span><span>✓ Autonomous daily follow-up</span></div>
      </section>
    </main>
  );
}

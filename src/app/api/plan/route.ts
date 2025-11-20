import { NextResponse } from "next/server";

type PlanRequest = {
  niche: string;
  persona: string;
  productOrOffer?: string;
  goal?: string;
  cadencePerWeek?: number;
  videoCount?: number;
  tone?: string;
};

type PlanIdea = {
  title: string;
  hook: string;
  outline: string[];
  callToAction: string;
  hashtags: string[];
  brollIdeas: string[];
  lengthSeconds: number;
};

type PlanResponse = {
  summary: string;
  postingSchedule: string[];
  contentPillars: string[];
  ideas: PlanIdea[];
};

const DEFAULT_HASHTAGS = [
  "#tiktok",
  "#fyp",
  "#learnontiktok",
  "#howto",
  "#creator",
  "#viral",
];

function pick<T>(arr: T[], count: number): T[] {
  const copy = [...arr];
  const chosen: T[] = [];
  while (chosen.length < count && copy.length > 0) {
    const idx = Math.floor(Math.random() * copy.length);
    chosen.push(copy.splice(idx, 1)[0]);
  }
  return chosen;
}

function slugify(input: string): string {
  return input.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");
}

function fabricateIdeas(req: PlanRequest, ideaCount: number): PlanIdea[] {
  const baseNiche = req.niche.trim();
  const tone = req.tone?.trim() || "concise and energetic";
  const persona = req.persona.trim();
  const offer = req.productOrOffer?.trim();

  const pillars = [
    "Education",
    "Behind the Scenes",
    "Myth Busting",
    "Quick Tips",
    "Storytime",
    "Challenge/Trend",
  ];

  const hooks = [
    `You won't believe this ${baseNiche} trick?`,
    `Stop scrolling if you care about ${baseNiche}!`,
    `The fastest way to improve at ${baseNiche}:`,
    `I tested every ${baseNiche} method so you don't have to`,
    `The truth about ${baseNiche} nobody tells you`,
    `3 mistakes ruining your ${baseNiche} results`,
    `${persona} explains ${baseNiche} in 30 seconds`,
  ];

  const ctas = [
    offer ? `Try ${offer} today ? link in bio` : "Follow for daily tips",
    "Comment 'PLAN' and I'll DM you the checklist",
    "Save this so you don't forget",
    "Share with a friend who needs this",
    offer ? `Grab the ${offer} free trial` : "Join the newsletter for more",
  ];

  const broll = [
    "Close-up hands demonstrating",
    "Screen recording with cursor highlights",
    "Whiteboard sketching",
    "Over-shoulder POV on desk",
    "Facecam with captions",
    "Product close-ups and macro shots",
    "Before/after split screen",
    "On-screen checklist with ticks",
  ];

  const topics = [
    `Beginner mistakes in ${baseNiche}`,
    `A day in the life of a ${persona}`,
    `Top 5 tools for ${baseNiche}`,
    `30-second tutorial: ${baseNiche} hack`,
    `Debunking myths in ${baseNiche}`,
    `What I wish I knew about ${baseNiche}`,
    `Do this before you start ${baseNiche}`,
    `One-take challenge: explain ${baseNiche} fast`,
  ];

  const ideas: PlanIdea[] = [];
  for (let i = 0; i < ideaCount; i++) {
    const pillar = pillars[i % pillars.length];
    const thisTopics = pick(topics, 1);
    const title = `${pillar}: ${thisTopics[0]}`;
    const outline = [
      "Hook (0-3s)",
      "Value/teaser (3-10s)",
      "Steps or insight (10-25s)",
      "CTA (last 3s)",
    ];
    const hashtags = [
      `#${slugify(baseNiche)}`,
      ...pick(DEFAULT_HASHTAGS, 3),
      `#${slugify(pillar)}`,
    ];
    const lengthSeconds = 28 + Math.floor(Math.random() * 7); // 28-34s
    ideas.push({
      title,
      hook: pick(hooks, 1)[0],
      outline,
      callToAction: pick(ctas, 1)[0],
      hashtags,
      brollIdeas: pick(broll, 3),
      lengthSeconds,
    });
  }
  return ideas;
}

function fabricateSchedule(weekly: number): string[] {
  const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
  const slots = ["9am", "12pm", "3pm", "6pm", "9pm"];
  const plan: string[] = [];
  let di = 0;
  for (let i = 0; i < weekly; i++) {
    plan.push(`${days[di % 7]} at ${slots[i % slots.length]} (${Intl.DateTimeFormat().resolvedOptions().timeZone})`);
    di += 2;
  }
  return plan;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as PlanRequest;
    const {
      niche = "content creation",
      persona = "coach",
      goal = "grow followers and conversions",
      cadencePerWeek = 5,
      videoCount = 10,
      tone = "concise and energetic",
    } = body || {};

    const ideas = fabricateIdeas(
      { niche, persona, productOrOffer: body.productOrOffer, goal, cadencePerWeek, videoCount, tone },
      Math.min(Math.max(videoCount, 5), 30)
    );

    const contentPillars = ["Education", "Behind the Scenes", "Myth Busting", "Quick Tips", "Storytime", "Challenge/Trend"];
    const postingSchedule = fabricateSchedule(Math.min(Math.max(cadencePerWeek, 1), 7));
    const summary = `A ${tone} TikTok plan for a ${persona} in ${niche} to ${goal}.`;

    const resp: PlanResponse = {
      summary,
      postingSchedule,
      contentPillars,
      ideas,
    };

    return NextResponse.json(resp, { status: 200 });
  } catch (err) {
    return NextResponse.json(
      { error: "Invalid request", detail: (err as Error).message },
      { status: 400 }
    );
  }
}


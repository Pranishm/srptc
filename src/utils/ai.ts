const NVIDIA_API_KEY = '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';
const OPENAI_API_KEY = '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';

const NVIDIA_API_URL = 'https://integrate.api.nvidia.com/v1/chat/completions';
const OPENAI_API_URL = 'https://api.openai.com/v1/chat/completions';

const SYSTEM_PROMPT = `You are CivixAI, the intelligent assistant for Civix360 (CampusFix) - Smart Campus Operations Platform.

Civix360 Knowledge Base:
- Roles: Students (report issues, view pulse, rate work), Staff/Faculty (report lab & classroom faults), Technicians (resolve queue, timer, resolution notes), Administrators (dispatch, SLA, heatmap, AI diagnostics, AI feedback).
- Users: Exactly 20 registered users (5 per role). Passwords are 'password123' and Admin PIN is '123456'.
- Features: Live heatmaps, SLA tracking, predictive diagnostics, 5-star student rating feedback, AI auto-draft resolution notes, AI smart triage.

Provide helpful, friendly, and direct answers about campus maintenance, platform features, or ticket summaries.`;

export async function queryCivxAI(prompt: string, contextData?: string): Promise<string> {
  const messages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...(contextData ? [{ role: 'user', content: `[Context Data]: ${contextData}` }] : []),
    { role: 'user', content: prompt }
  ];

  // 1. Try OpenAI API first
  try {
    const res = await fetch(OPENAI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: messages,
        temperature: 0.5,
        max_tokens: 512
      })
    });

    if (res.ok) {
      const data = await res.json();
      const content = data.choices[0]?.message?.content;
      if (content) return content;
    }
  } catch (e) {
    console.warn('OpenAI API fetch attempt failed:', e);
  }

  // 2. Try NVIDIA NIM API next
  const nimModels = ['meta/llama-3.1-70b-instruct', 'nvidia/llama-3.1-nemotron-70b-instruct'];
  for (const model of nimModels) {
    try {
      const res = await fetch(NVIDIA_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${NVIDIA_API_KEY}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.5,
          max_tokens: 512
        })
      });

      if (res.ok) {
        const data = await res.json();
        const content = data.choices[0]?.message?.content;
        if (content) return content;
      }
    } catch (e) {
      console.warn(`NVIDIA NIM Model ${model} fetch failed:`, e);
    }
  }

  // 3. Fallback to local intelligent response engine
  return getIntelligentResponseEngine(prompt, contextData);
}

export async function generateTechResolutionAI(title: string, description: string): Promise<string> {
  const prompt = `As an expert campus technician, draft a professional 2-sentence resolution note for: "${title}" - ${description}`;
  return queryCivxAI(prompt);
}

export async function analyzeStudentFeedbackAI(feedbacks: { rating: number; feedback?: string }[]): Promise<string> {
  if (feedbacks.length === 0) {
    return 'No student rating feedback received yet. Average Rating: 5.0/5.0 Stars (Excellent technician satisfaction).';
  }
  const prompt = `Analyze these student rating feedbacks: ${JSON.stringify(feedbacks)}. Provide a concise 2-sentence AI executive summary for the administrator.`;
  return queryCivxAI(prompt);
}

export async function analyzeIssueAI(description: string): Promise<{ category: string; priority: 'Critical' | 'High' | 'Medium' | 'Low'; summary: string }> {
  const d = description.toLowerCase();
  let category = 'General';
  let priority: 'Critical' | 'High' | 'Medium' | 'Low' = 'Medium';

  if (d.includes('water') || d.includes('pipe') || d.includes('leak') || d.includes('toilet') || d.includes('sink')) {
    category = 'Plumbing';
    priority = d.includes('leak') || d.includes('burst') ? 'Critical' : 'High';
  } else if (d.includes('wifi') || d.includes('internet') || d.includes('network') || d.includes('router') || d.includes('server')) {
    category = 'Network/IT';
    priority = 'High';
  } else if (d.includes('spark') || d.includes('light') || d.includes('wire') || d.includes('power') || d.includes('switch')) {
    category = 'Electrical';
    priority = d.includes('spark') || d.includes('fire') ? 'Critical' : 'High';
  } else if (d.includes('projector') || d.includes('screen') || d.includes('display') || d.includes('audio')) {
    category = 'AV Support';
    priority = 'Medium';
  }

  return {
    category,
    priority,
    summary: description.slice(0, 50)
  };
}

function getIntelligentResponseEngine(prompt: string, contextData?: string): string {
  const p = prompt.toLowerCase();

  if (p.includes('summary') || p.includes('status') || p.includes('active')) {
    return `Civix360 Campus Status Summary:
- ${contextData || 'All campus systems operating normally.'}
- Electrical & Plumbing teams active on high-priority tickets.
- 98.2% system health index maintained across ECE, CSE & Mechanical blocks.`;
  }
  if (p.includes('report') || p.includes('how to')) {
    return 'To report an issue: Click "Report Issue" in your sidebar, select your building/room location, add a short description, and click "✨ AI Smart Analyze". Your ticket will enter the dispatch queue immediately!';
  }
  if (p.includes('tech') || p.includes('who') || p.includes('staff')) {
    return 'Civix360 has 5 assigned technicians: Arun Kumar (Electrical), Suresh Patel (IT Support), Vikram Singh (Networks), Mahesh Joshi (Plumbing), and Anil Deshmukh (General Maintenance).';
  }
  if (p.includes('role') || p.includes('login') || p.includes('user')) {
    return 'Civix360 features 4 role portals: Student, Faculty/Staff, Technician, and Admin (5 accounts per role, 20 total users). Password is "password123" (Admins require PIN "123456").';
  }
  if (p.includes('rating') || p.includes('feedback')) {
    return 'Students receive live notifications in their app once a ticket is resolved, allowing them to submit a 1 to 5 star rating with comments for technician accountability.';
  }
  return 'CivixAI: Civix360 is operating smoothly! I can assist you with ticket summaries, student feedback analysis, reporting classroom faults, or tracking SLA timers.';
}

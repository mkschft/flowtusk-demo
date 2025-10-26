import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const { content } = await req.json();

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 });
    }

    console.log('🧠 [Generate ICPs] Starting generation');
    console.log('📊 [Generate ICPs] Content length:', content.length, 'chars');

    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are a B2B marketing expert. Analyze the website content and generate 3 distinct Ideal Customer Profiles (ICPs) with realistic personas.
          
Each ICP should be unique and target a different segment. Create believable persona details that represent the archetype.

Return ONLY valid JSON in this exact format:
{
  "icps": [
    {
      "id": "unique-id",
      "title": "Short segment title (e.g., 'Enterprise CTOs')",
      "description": "One sentence description of the segment",
      "painPoints": ["Short pain 1-2 words", "Another short pain", "Third pain"],
      "goals": ["goal1", "goal2", "goal3"],
      "demographics": "Brief demographics and firmographics",
      "personaName": "Full name (realistic, diverse)",
      "personaRole": "Job title",
      "personaCompany": "Company type with size (e.g., 'Acme Corp (200 employees)')"
    }
  ],
  "brandColors": {
    "primary": "#000000",
    "secondary": "#666666"
  }
}

IMPORTANT: Keep painPoints very SHORT (1-3 words max) like "Time constraints", "Budget limits", "Manual processes"

Persona guidelines:
- Use diverse, realistic names from various backgrounds
- Match role seniority to the ICP segment
- Company size should align with segment (SMB vs Enterprise)
- Each persona should feel like a real person you'd meet

Brand Color Inference:
Analyze the website content and infer 2 brand colors (primary and secondary) as hex codes. Base this on:
- Company name associations (e.g., Stripe = purple, Notion = black/white)
- Industry standards (fintech = blue/green, creative = vibrant)
- Content tone and keywords
Return these in the brandColors field.`,
        },
        {
          role: "user",
          content: `Website content:\n\n${content}\n\nGenerate 3 ICPs in JSON format.`,
        },
      ],
      temperature: 0.8,
      response_format: { type: "json_object" },
    });

    const genTime = Date.now() - startTime;
    console.log(`⚡ [Generate ICPs] OpenAI completed in ${genTime}ms`);

    const result = JSON.parse(completion.choices[0].message.content || "{}");

    console.log('✅ [Generate ICPs] Generated', result.icps?.length || 0, 'profiles');
    console.log('🎨 [Generate ICPs] Brand colors:', result.brandColors);

    return NextResponse.json({ 
      icps: result.icps || [],
      brandColors: result.brandColors || { primary: "#FF6B9D", secondary: "#A78BFA" }
    });
  } catch (error) {
    console.error("Error generating ICPs:", error);
    return NextResponse.json(
      { error: "Failed to generate ICPs" },
      { status: 500 }
    );
  }
}

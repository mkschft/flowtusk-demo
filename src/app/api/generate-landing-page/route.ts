import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const titleOnlyPrompts = {
  hero: `Generate ONLY the headline for a hero section. Return ONLY valid JSON:
{
  "sectionData": {
    "headline": "Powerful, benefit-driven headline (8-12 words)",
    "subheadline": "",
    "cta": ""
  }
}`,

  testimonial: `Generate ONLY placeholder text for a testimonial. Return ONLY valid JSON:
{
  "sectionData": {
    "quote": "",
    "author": "",
    "role": "",
    "company": ""
  }
}`,

  features: `Generate ONLY 3 feature titles (no descriptions). Return ONLY valid JSON:
{
  "sectionData": {
    "items": [
      { "title": "Feature title 1 (3-5 words)", "description": "" },
      { "title": "Feature title 2 (3-5 words)", "description": "" },
      { "title": "Feature title 3 (3-5 words)", "description": "" }
    ]
  }
}`,

  problemSolution: `Generate ONLY placeholder text. Return ONLY valid JSON:
{
  "sectionData": {
    "problems": [],
    "solution": ""
  }
}`,

  stats: `Generate ONLY 3 stat labels (no values yet). Return ONLY valid JSON:
{
  "sectionData": {
    "items": [
      { "value": "", "label": "Metric label 1" },
      { "value": "", "label": "Metric label 2" },
      { "value": "", "label": "Metric label 3" }
    ]
  }
}`
};

const fullPrompts = {
  hero: `Generate a complete hero section. Return ONLY valid JSON:
{
  "sectionData": {
    "headline": "Powerful, benefit-driven headline (8-12 words)",
    "subheadline": "Supporting subheadline that clarifies the value (15-20 words)",
    "cta": "Clear CTA button text (2-4 words)"
  }
}`,

  testimonial: `Generate a complete testimonial section. Return ONLY valid JSON:
{
  "sectionData": {
    "quote": "Realistic testimonial quote (20-30 words)",
    "author": "Full name (realistic)",
    "role": "Job title",
    "company": "Company name (realistic for this industry)"
  }
}`,

  features: `Generate a complete features section with 3 key benefits. Return ONLY valid JSON:
{
  "sectionData": {
    "items": [
      {
        "title": "Feature/benefit title (3-5 words)",
        "description": "Brief description (15-20 words)"
      },
      {
        "title": "Feature/benefit title (3-5 words)",
        "description": "Brief description (15-20 words)"
      },
      {
        "title": "Feature/benefit title (3-5 words)",
        "description": "Brief description (15-20 words)"
      }
    ]
  }
}`,

  problemSolution: `Generate a complete problem-solution section. Return ONLY valid JSON:
{
  "sectionData": {
    "problems": ["Problem 1 they face", "Problem 2 they face", "Problem 3 they face"],
    "solution": "How your product solves these problems (30-40 words)"
  }
}`,

  stats: `Generate 3 complete impressive statistics. Return ONLY valid JSON:
{
  "sectionData": {
    "items": [
      {
        "value": "87%",
        "label": "Metric label"
      },
      {
        "value": "2.5x",
        "label": "Metric label"
      },
      {
        "value": "15min",
        "label": "Metric label"
      }
    ]
  }
}`
};

export async function POST(req: NextRequest) {
  try {
    const { icp, websiteUrl, heroImage, brandColors, section, mode = 'full' } = await req.json();

    if (!icp) {
      return NextResponse.json({ error: "ICP is required" }, { status: 400 });
    }

    if (!section) {
      return NextResponse.json({ error: "Section is required" }, { status: 400 });
    }

    console.log(`📝 [Generate Section] Starting ${section} (${mode}) for:`, icp.title);

    // Select the appropriate prompts based on mode
    const prompts = mode === 'title' ? titleOnlyPrompts : fullPrompts;
    const sectionPrompt = prompts[section as keyof typeof prompts];
    
    if (!sectionPrompt) {
      return NextResponse.json({ error: "Invalid section" }, { status: 400 });
    }

    const startTime = Date.now();
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: `You are an expert copywriter specializing in high-converting B2B landing pages.
          
${sectionPrompt}

Make content believable, specific to this ICP, and highly relevant to their pain points and goals.`,
        },
        {
          role: "user",
          content: `ICP Details:
Title: ${icp.title}
Description: ${icp.description}
Pain Points: ${icp.painPoints.join(", ")}
Goals: ${icp.goals.join(", ")}
Demographics: ${icp.demographics}
Website: ${websiteUrl}

Generate the ${section} section in JSON format (${mode} mode).`,
        },
      ],
      temperature: 0.9,
      response_format: { type: "json_object" },
    });

    const genTime = Date.now() - startTime;
    console.log(`⚡ [Generate Section] ${section} (${mode}) completed in ${genTime}ms`);

    const result = JSON.parse(completion.choices[0].message.content || "{}");
    
    console.log(`✅ [Generate Section] ${section} (${mode}) complete`);

    return NextResponse.json({ sectionData: result.sectionData });
  } catch (error) {
    console.error("Error generating section:", error);
    return NextResponse.json(
      { error: "Failed to generate section" },
      { status: 500 }
    );
  }
}

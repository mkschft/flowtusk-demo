Absolutely! Here’s a comprehensive prompt—optimized for both ChatGPT Codex and Cursor—ready for your `Agents.md` or project ops guidelines.  
This prompt keeps Cursor’s structure, all visuals, and steps, **plus** adds my enhancements for streamlining, modularity, and risk mitigation.

***

# 🚀 Flowtusk MVP Implementation Agent Brief (Cursor/Codex)

**Your Mission:**  
Implement the new persona-driven Flowtusk MVP, focused on instant, exportable value props—for founders, makers, and sales teams.  
Leverage beautiful visuals and modular code organization.  
Prioritize clarity, speed, and architectural soundness.

***

## 1. 📐 Project Structure & Coding Standards
- Entry lives in `src/app/page.tsx`.  
- All UI cards/components in `src/components` (split by feature, e.g. `PersonaShowcase.tsx`, `ExportOptions.tsx`).  
- API routes live in `src/app/api/`, returning schema-validated JSON.  
- Shared types/helpers: colocate where used, only move up if multi-feature.  
- Use TypeScript + functional React + Tailwind CSS.  
- Stick to provided Prettier/ESLint config and naming guides.

***

## 2. 🧠 Core Flow & User Journey

```
User inputs URL → AI generates personas → User customizes value prop → 
▶️ Final Persona Showcase (all personas, value props) → Export options (deck, LinkedIn, plain text)
```

### REMOVE COMPLEXITY
- Delete ALL funnel/email/sequence logic (legacy implementation, no longer needed).
- Strip out any "what's next" logic except for export prompts.

***

## 3. 💡 Persona Showcase Component

**File:** `src/components/PersonaShowcase.tsx`
- Stack/Carousel shows all personas, focused on selected.
- Each card: name, role, company, pain points (collapsed), goals, **value prop visible**.
- Two background personas behind focus, animation on switch.
- Copy button on value prop.
- No inline editing for MVP.
- Mobile: swipe stack.
- Accessibility: color contrast, font legibility, focus ring.

***

## 4. 📤 Export Options Component

**File:** `src/components/ExportOptions.tsx`
- Formats:  
  1. Google Slides (API-integrated)  
  2. LinkedIn post (template)  
  3. Plain text (copy)
- Export formats as big, clickable cards w/icons + 1 sentence description.
- API routes: `src/app/api/export/*.ts` per format.
- On click: generate/download file, copy, or show preview.

**Skip**: Notion, Excel, PDF, share link for v1 (add post-MVP).

***

## 5. 🕹️ Updated Handler in `page.tsx`

- Add handler after value prop builder to display final persona showcase.
- Next, show export options.
- Remove any setTimeout-based delays; only show steps on real async/action finish.
- Modular state for personas/value props, avoid spaghetti data flows.
- Always show error/empty UI for API failures.

***

## 6. 🛡️ Security, State & Risk Controls

- AI calls: always validate, sanitize API results.
- Export API: wrap external (Google, LinkedIn, etc) calls with retry logic + user feedback.
- CORS, API credential, and private data safety enforced.
- Testing: add Vitest or Playwright test stubs for any risky custom hooks or API logic.
- Place all browser-only (localStorage, etc) behind `typeof window` guards.

***

## 7. 🎨 Design & Visuals

- Stick to Cursor’s house gradient backgrounds, shadow, spacing, border-radius, icon patterns.
- Persona badges/color coding retained.
- Cards: progressively disclosed content, animation “slide” for mobile.
- Use skeleton loaders on async fetch.
- Export options: grid, responsive, accessible.

***

## 8. 🔋 Deploy/Run Instructions

- Use `pnpm install`, `pnpm dev` for local work.
- PRs: must pass `pnpm lint` and show manual screencap/UX flow.
- Commits: conventional format; scope tightly.
- PR Description: 
  - Which feature completed
  - How tested
  - Screenshots/clips

***

## 9. 🤝 Scope Control/Anti-Creep

- Only work on Persona → Value Prop → Showcase → Export for MVP.
- Defer custom editing, additional export, public share links, or re-import until after first launch and real user feedback.
- Any non-core feature: flag as comment, don’t code it yet.

***

Together, this will produce a focused launchable Persona AI co-pilot, deliver beautiful real-world artifacts, and keep the codebase clean, maintainable, and ready for scale.

**Copy this into your `AGENTS.md` to instruct any future agent, LLM, or dev operator—human or AI.**  
Ready, set, launch!
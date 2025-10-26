# Chat Refinement Feature

## Overview
Added v0-style chat-based refinement to the landing page preview step. Users can now iterate on generated pages using natural language.

## What Was Added

### 1. Chat API Route (`/api/chat`)
- Streaming responses using AI SDK
- 5 tool functions for updating page sections:
  - `updateHeadline` - Change main headline
  - `updateSubheadline` - Update subheadline
  - `updateValueProps` - Modify value propositions
  - `updateCTA` - Change CTA button text
  - `regenerateSection` - Completely regenerate a section with guidance

### 2. Preview Layout
- Split-screen design: Preview (left) + Chat (right)
- Preview panel: Scrollable landing page with live updates
- Chat panel: Message history + input field

### 3. Real-time Updates
- Uses `useChat` hook from AI SDK
- `onToolCall` callback updates landing page state immediately
- Changes reflect in preview as agent makes edits

## Usage

1. Generate landing page (existing flow)
2. In preview step, use chat panel on the right
3. Ask for changes in natural language:
   - "Make the headline shorter"
   - "Add more urgency to the CTA"
   - "Rewrite the value props to focus on ROI"
4. Agent will use tools to update specific sections
5. Preview updates in real-time

## Tech Stack
- **AI SDK** (`ai` package) - Streaming & tool calling
- **@ai-sdk/openai** - OpenAI integration
- **useChat hook** - React hook for chat UI
- **zod** - Tool parameter validation
- Existing design system (Flowtusk colors, shadcn/ui)

## Next Iterations
- [ ] Add undo/redo functionality
- [ ] Save chat history with published pages
- [ ] Add tool for adding new sections
- [ ] Export refined pages as HTML/React
- [ ] Add suggested prompts based on ICP

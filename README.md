# AI-Assisted Behavior Intervention Designer

## Live Demo

[Open the live app](https://ai-behavior-intervention-designer-q56m4n08o.vercel.app/)

A context-aware digital health prototype for translating walking barriers into feasible micro-interventions using transparent recommendation logic.

## Overview

This project is a React-based digital health prototype that helps generate behavior change intervention suggestions based on a user's walking goal, main barrier, time of day, confidence level, fatigue, pain, and preferred support style.

The app does not use an external AI API. Instead, it uses transparent rule-based recommendation logic as an early prototype for AI-assisted behavior intervention design.

The main idea is:

> Health behavior change is not only about giving information. It requires designing actions that fit real-world barriers, routines, and contexts.

## Why I Built This

Many health interventions encourage people to walk more, but real-world behavior is shaped by daily constraints.

A person may know that walking is beneficial but still struggle because of:

- lack of time
- fatigue
- pain
- weather
- low motivation
- low confidence
- poor fit with existing routines

This project explores how contextual information can be translated into small, feasible behavior change strategies.

## Key Features

- User input form for walking goal and contextual barriers
- Transparent rule-based recommendation logic
- Personalized micro-intervention suggestion
- If-then planning support
- Safety-aware note
- Reflection prompt
- Explanation of why the recommendation fits the user's context
- Clean digital health research prototype design

## Inputs

The app asks users to enter:

- walking goal in minutes
- main barrier
- time of day
- walking purpose
- confidence level
- fatigue level
- pain level
- preferred support style

## Outputs

The app generates:

- suggested strategy
- micro-intervention
- if-then plan
- safety-aware note
- reflection prompt
- explanation of why the recommendation fits the user's context

## Recommendation Logic

This prototype uses transparent rule-based logic.

Examples:

- lack of time → reduce friction and attach the action to an existing routine
- fatigue → lower intensity and use flexible timing
- pain → prioritize safety, gentle movement, and stopping if pain increases
- weather → suggest indoor alternatives and backup plans
- low motivation → create immediate reward and small success
- no major barrier → focus on maintenance and progress tracking

This approach is intentionally simple and interpretable.

## AI Framing

This project is not a generative AI chatbot.

Instead, it demonstrates an early step toward AI-assisted intervention design by showing how user context can be mapped to behavior change strategies through transparent decision logic.

Future versions could incorporate machine learning or large language models, but only with appropriate safeguards for safety, clinical appropriateness, usability, and transparency.

## Disclaimer

This prototype provides behavior change support suggestions and is not medical advice.

Users with pain, medical conditions, or safety concerns should consult a qualified healthcare professional before changing their physical activity routine.

## Research Relevance

This project connects to my broader interests in:

- digital health
- healthcare AI
- behavior change
- chronic disease self-management
- walking interventions
- implementation science
- human-centered intervention design
- responsible AI in health
- clinical usability and safety

The project reflects a central research question:

> How can health behavior data and contextual signals be translated into safe, feasible, and usable interventions?

## Tech Stack

- React
- Vite
- JavaScript
- CSS
- Vercel

## Project Status

This is an early-stage digital health and AI-assisted intervention design prototype.

## Future Improvements

Future versions could include:

- saving generated intervention plans
- exporting intervention plans as PDF or CSV
- adding weekly behavior tracking
- connecting with walking adherence prediction results
- adding a safety and usability evaluation rubric
- testing the prototype with simulated user scenarios
- adding AI-generated suggestions with guardrails
- comparing rule-based and AI-generated recommendations

## How to Run This Project Locally

1. Clone this repository.

```bash
git clone https://github.com/YOUR-USERNAME/ai-behavior-intervention-designer.git
```

2. Move into the project folder.

```bash
cd ai-behavior-intervention-designer
```

3. Install dependencies.

```bash
npm install
```

4. Start the development server.

```bash
npm run dev
```

5. Open the local URL shown in the terminal. It is usually:

```bash
http://localhost:5173/
```
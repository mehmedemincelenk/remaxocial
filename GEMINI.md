# Remaxocial Project Context

## Project Overview
Remaxocial is an AI-powered real estate social platform designed for consultants. It automates high-end content creation, manages consultant profiles, and provides a "Video Studio" for marketing automation.

## Core Tech Stack
- **Framework:** React 19 (Vite)
- **Styling:** Tailwind CSS 4 (`@tailwindcss/vite`) - *Note: Prefer Vanilla CSS/Tailwind for flexibility.*
- **Backend:** Supabase (Auth, DB, Storage)
- **Animations:** Framer Motion (Core to the "vibe" and user experience)
- **AI Integration:** Google Generative AI, OpenAI, Groq SDK
- **Icons:** Lucide React, React Icons

## Key Architectural Patterns
- **Directory Structure:**
    - `src/components/danisman/`: Profile-specific components (Turkish domain naming).
    - `src/components/hub/`: Main platform features (Navbar, Feed, etc.).
    - `src/components/ortak/`: Reusable, atomic UI components (GlassCard, MegaToggle).
    - `src/pages/`: Routing-level views.
    - `src/utils/`: Business logic, especially `aiPrompts.js` for complex prompt mixing.
- **Data Management:** Content is primarily driven by JSON files in `src/data/` and `public/data/`.
- **Vibe Coding:** High emphasis on "Glassmorphism" aesthetics and smooth transitions using Framer Motion.

## Development Guidelines
- **Naming:** Business-specific terms use Turkish (`danisman`, `akademi`, `ajansa`), while technical infrastructure uses English.
- **Components:** Always check `src/components/ortak/` for existing UI patterns before building new ones.
- **AI Logic:** Centralized in `src/utils/aiPrompts.js`. Use `promptMixer` for image/content generation tasks.
- **Testing:** Verify changes across desktop and mobile wrappers (see `DesktopWrapper.jsx`).

## Important Files
- `src/App.jsx`: Main routing and layout structure.
- `src/utils/aiPrompts.js`: Core AI orchestration logic.
- `PLAN.md`: Strategic roadmap and "Eller Serbest" (Hands-Free) automation vision.
- `vite.config.js`: Modern Vite 8 + Tailwind 4 configuration.

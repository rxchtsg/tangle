
# Tangle

> **Let your thoughts get tangled.**

Tangle is an AI-native second brain designed for nonlinear thinkers.

Instead of forcing every thought into a folder, task list, or perfectly organized note, Tangle gives you a place to dump whatever is on your mind — ideas, questions, tasks, references, reminders, and half-formed thoughts.

Tangle's job is to make sense of the mess later: finding patterns, connecting related thoughts, and surfacing the threads you might have forgotten.

## Why Tangle?

Most productivity tools ask you to organize your thoughts before you capture them.

But real thinking isn't linear.

You might start with a question, jump to an idea, save a link, remember something you need to do, and suddenly have five disconnected thoughts that are actually related.

Tangle is built around the opposite philosophy:

**Capture first. Make sense of it later.**

---

## ✦ What it does

- **Capture anything** — thoughts, ideas, questions, tasks, references, and more
- **Automatic classification** — understand what kind of thought you've captured
- **Persistent memory** — thoughts remain available across sessions
- **Personal thought space** — visualize and explore your growing collection of ideas
- **Thread discovery** — connect related thoughts and uncover emerging themes
- **AI organization** — turn an unstructured stream of thoughts into meaningful groups
- **Projects & contexts** — let related thoughts naturally form larger areas of focus

> Tangle is currently under active development. Some of these capabilities are part of the roadmap.

---

## ✦ Product

Tangle is intentionally designed to feel more like a **personal thinking environment** than a traditional productivity dashboard.

The interface uses spatial relationships, subtle motion, translucent materials, and ambient visual effects to represent the way ideas move and connect.

The goal is simple:

**Less organizing. More thinking.**

---

## ✦ Tech Stack

### Frontend

- **Next.js** — App Router
- **React**
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui**

### Backend

- **Supabase**
  - PostgreSQL
  - Authentication
  - Row Level Security
- **Next.js Route Handlers**

### AI

AI capabilities are being introduced incrementally, beginning with thought classification and eventually expanding into organization, relationships, and semantic discovery.

---

## ✦ Architecture

At a high level:

```text
                         TANGLE

                    ┌─────────────┐
                    │    User     │
                    └──────┬──────┘
                           │
                           ▼
                    ┌─────────────┐
                    │  Tangle UI  │
                    │   Next.js   │
                    └──────┬──────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │  API / Server   │
                  │ Route Handlers  │
                  └────────┬────────┘
                           │
                           ▼
                  ┌─────────────────┐
                  │    Supabase     │
                  │                 │
                  │  Auth           │
                  │  PostgreSQL     │
                  │  Row-Level      │
                  │  Security       │
                  └─────────────────┘

The application uses Supabase authentication and PostgreSQL persistence, with Row Level Security ensuring that users can only access their own thoughts.
✦ Development
Clone the repository:
git clone https://github.com/rxchtsg/tangle.git
cd tangle

Install dependencies:
pnpm install

Create a .env.local file:
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_key

Start the development server:
pnpm dev

Open http://localhost:3000.
✦ Project Status
Tangle is an evolving portfolio project and a playground for exploring:
- AI-native product design
- Human-computer interaction
- Generative interfaces
- Personal knowledge systems
- AI-assisted organization
- Modern full-stack development
The current version focuses on the core capture, authentication, persistence, and thought-management infrastructure.
The next layer is making Tangle genuinely intelligent.
✦ Roadmap
Now
- [x] Thought capture
- [x] Thought classification foundation
- [x] Supabase authentication
- [x] Persistent thought storage
- [x] Row Level Security
- [x] Pinning
- [ ] AI-powered classification
Next
- [ ] AI thought organization
- [ ] Thread discovery
- [ ] Related thought connections
- [ ] Semantic search
- [ ] Projects and contexts
- [ ] Daily resurfacing / "Today"
- [ ] Smarter personal insights
Eventually
- [ ] Embeddings and semantic memory
- [ ] Cross-thought reasoning
- [ ] Automatic project formation
- [ ] Richer multimodal capture
- [ ] Voice input

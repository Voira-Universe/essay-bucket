# Essay Bucket

> **Internal Tool**

Essay Bucket is a specialized data collection dashboard designed to aggregate high-quality, pre-2019 "golden" essays. This dataset serves as the foundational training material ("feeding the Orchestrator") for fine-tuning our specialized Llama models.

<img width="1470" height="881" alt="Screenshot 2026-01-14 at 10 56 37 AM" src="https://github.com/user-attachments/assets/cd7ca636-18c0-4dd1-8359-3abdcc26e284" />


## 🚀 Features

- **Minimalist Interface**: Distraction-free, monochrome design focused on data entry speed.
- **Client-Side Embeddings**: Automatically generates vector embeddings for essays using `@xenova/transformers` directly in the browser before submission.
- **Real-time Metrics**: Live progress tracking towards the collection goal (2,000 essays) synced with Supabase.
- **Data Validation**: Enforces "golden" standard requirements (pre-2019 sources).

## 🛠 Tech Stack

- **Framework**: React 18 + Vite
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Database**: Supabase
- **ML Engine**: Transformers.js (In-browser embedding generation)
- **Deployment**: Netlify

## ⚡️ Getting Started

### Prerequisites

- Node.js (v18 or higher)
- NPM or PNPM

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd essay-collection-dashboard
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```

## 🗄️ Database Schema

The application connects to a Supabase `essays` table with the following structure:

| Column | Type | Description |
|--------|------|-------------|
| `id` | uuid | Primary Key |
| `created_at` | timestamp | Auto-generated timestamp |
| `prompt` | text | The essay prompt or question |
| `content` | text | The full essay text |
| `source` | text | Citation or origin (e.g., "NYT, 2018") |
| `is_golden` | boolean | Flag for high-quality data (default: `true`) |
| `embedding` | vector | Semantic vector representation |

## 🧪 Development Notes

- **Embeddings**: The app downloads the embedding model locally on the first load. This might take a moment but ensures privacy and zero API costs for embedding generation.
- **Strict Mode**: React Strict Mode is enabled, so effects may fire twice in development.

---

**Status**: Active Development  
**Version**: 0.1.0

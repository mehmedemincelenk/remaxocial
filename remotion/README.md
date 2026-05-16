# Remotion Video Engine 🎥

This project is a high-performance video generation engine built with **Remotion** and **React**. It automates the creation of news videos, victory cards, and interactive social media content.

## 🚀 Getting Started

### Prerequisites
- Node.js installed
- npm or yarn

### Installation
```bash
npm install
```

### Running the Project
- **Preview in Studio:**
  ```bash
  npm start
  ```
- **Render a Video:**
  ```bash
  npm run render
  ```
- **Start Backend Server (for dynamic assets):**
  ```bash
  node server.mjs
  ```

## 📂 Project Structure
- `src/Root.tsx`: The main entry point where all video compositions are registered.
- `src/templates/`: Contains all React components for different video styles.
- `src/data/`: Static data files used to populate video content.
- `public/`: Assets like fonts, images, and audio.
- `server.mjs`: API server for handling file uploads and dynamic assets.
- `publish.mjs`: Automation script to upload rendered videos to Instagram via Supabase.

## 🛠 Tech Stack
- **Framework:** [Remotion](https://www.remotion.dev/)
- **UI Library:** React 19
- **Validation:** Zod
- **Backend:** Express
- **Cloud Storage:** Supabase
- **Typography:** Google Fonts (via @remotion/google-fonts)

## 🔧 Configuration
Copy `.env.example` to `.env` and fill in your credentials for Supabase and Instagram API:
```bash
cp .env.example .env
```

## 📜 License
This project follows the Remotion licensing model. See [Remotion License](https://github.com/remotion-dev/remotion/blob/main/LICENSE.md) for more details.

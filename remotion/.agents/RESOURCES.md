# External Resources & Libraries

This project leverages curated community libraries from the Remotion ecosystem to enhance visual quality.

## 🔠 Typography & Motion
- **`remotion-animate-text`**: Use for premium, per-character or per-word text entrance animations.
  - *Usage:* `import { AnimateText } from 'remotion-animate-text';`
- **`@remotion/motion-blur`**: Use to add cinematic smoothness to moving elements.
  - *Usage:* Wrap moving components in `<MotionBlur>`.

## 💬 Captions & Subtitles
- **`remotion-subtitle`**: Helpers for rendering and styling synchronized captions.

## 🎬 Transitions
- **`@remotion/transitions`**: Standard scene transitions (slide, fade, wipe).

## 🛠 Best Practices
- Always check `.agents/remotion/rules/` for specific implementation details of these libraries.
- Prefer these lightweight helpers over heavy manual frame calculations when possible.

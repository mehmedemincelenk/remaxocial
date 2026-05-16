# Premium Typography with AnimateText

- Use `remotion-animate-text` for all main titles and highlights in the "Veri" hub.
- **Why?** Standard CSS entrances can feel static. Character-level animation increases "Watch Time" on social media.
- **Pattern:**
  ```tsx
  import { AnimateText, LinearReveal } from 'remotion-animate-text';
  
  <AnimateText
    text="Your Title"
    type="words"
    duration={30}
    delay={10}
    renderCharacter={(char, index) => <LinearReveal char={char} index={index} />}
  />
  ```
- **Performance:** Keep animation durations under 45 frames for snappy, high-energy Reels.

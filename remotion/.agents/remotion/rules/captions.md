# Captions and Subtitles in Remotion

- Use `@remotion/captions` for rendering SRT/VTT files.
- Integration with Whisper:
  1. Generate transcript using `whisper-cpp`.
  2. Parse the output into a JSON format.
  3. Use the `Captions` component to display synchronized text.
- Styling: Use `AbsoluteFill` and `spring()` for text animations to make captions "pop".
- Frame accuracy: Ensure transcript timestamps are converted to frame numbers based on the video's FPS.

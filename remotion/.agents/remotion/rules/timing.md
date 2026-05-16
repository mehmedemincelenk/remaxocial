# Timing in Remotion

- Always think in **frames**, not seconds.
- Calculate duration: `durationInFrames = durationInSeconds * fps`.
- Use `useCurrentFrame()` to get the current position.
- Avoid `setTimeout` or `setInterval`; they do not work during rendering.
- For animations, use the `frame` value to interpolate properties.
- Use `<Sequence>` to shift the timebase for child components.

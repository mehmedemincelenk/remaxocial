# Calculating Metadata

- Use `calculateMetadata` in `Composition` to dynamically set `durationInFrames`.
- Common use case: Matching video length to an audio file.
- Example:
  ```typescript
  <Composition
    {...}
    calculateMetadata={async ({ props }) => {
      const duration = await getAudioDurationInSeconds(props.audioUrl);
      return {
        durationInFrames: Math.ceil(duration * fps),
      };
    }}
  />
  ```
- Always provide a fallback `durationInFrames` in case the async calculation fails.

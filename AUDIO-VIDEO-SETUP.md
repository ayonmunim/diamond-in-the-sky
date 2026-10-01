# Space piano and local mission videos

## Listen

Start the app with `npm run dev`, open Settings, and enable **Background music**. Tap or click once if the browser has not unlocked audio yet.

**Little Star Voyage** is an original eight-bar, 76 BPM piano-style synthesized melody with soft accompaniment and a light echo. It loops without downloading an audio recording. The Music volume slider changes the live level; zero mutes it. Music stops while the tab is hidden and resumes when visible if audio has already been unlocked.

The score lives in `src/lib/space-piano.ts`; the audio lifecycle and existing sound effects are in `src/lib/audio.tsx`. This is synthesized piano-style audio, not an acoustic piano recording.

## Local videos

The ten original MP4s from the Lovable project are saved in **src/assets**:

- `level1-cartoon.mp4` through `level5-cartoon.mp4`: What is a Star? mission.
- `m2-level1-cartoon.mp4` through `m2-level5-cartoon.mp4`: Why Do Stars Twinkle? mission.

They total approximately 402 MB. The original `.mp4.asset.json` files are preserved. `src/data/cinematicStories.tsx` imports the MP4 binaries with `?url`, so Vite serves them locally and includes them in its build output. Existing captions, controls, and the video-to-activity flow are retained.

Other missions continue to use their existing animated scenes. No replacement videos were generated.

Open **Play → chapter → mission → level** to watch. You can also open an MP4 directly from `src/assets` with your computer's video player.

If restoring a checkout without the binaries:

```powershell
cd "D:\Munim\diamondinthesky"
node scripts/download-mission-videos.mjs
```

The downloader reads the original metadata, downloads from the project's Lovable preview, checks byte size and MP4 file type, and skips already-complete files. It does not modify the Lovable project. Keep the local binaries or a backup because future access to the preview is not guaranteed.

## Undo the code changes

Backups are saved in `.review-backup/piano-videos`. Stop the server, preserve any later edits, then run:

```powershell
Copy-Item -LiteralPath '.review-backup/piano-videos/audio.tsx' -Destination 'src/lib/audio.tsx'
Copy-Item -LiteralPath '.review-backup/piano-videos/settings.tsx' -Destination 'src/routes/settings.tsx'
Copy-Item -LiteralPath '.review-backup/piano-videos/cinematicStories.tsx' -Destination 'src/data/cinematicStories.tsx'
```

This restores the old audio and video-reference code. The downloaded MP4s remain available; restoring the old video code also restores the Lovable-only URLs, which may not work locally.

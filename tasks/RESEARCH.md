# Research: Gemini CLI GUI Wrapper

## Objective
Create an "all-encompassing" GUI for the Gemini CLI to replace/augment terminal usage.
**Key Features:**
- Visual Interface (Buttons, Rich Text).
- Voice Recognition (Speech-to-Text).
- Text-to-Speech (TTS).
- Modern, polished aesthetic.

## Implemented Architecture

### System Overview
The application follows a **Client-Server** model bridging a web-based UI with a local shell process.

*   **Frontend (Client):**
    *   **Framework:** React 19 + Vite.
    *   **Styling:** Tailwind CSS with a custom "Cyberpunk" theme (Neon Green/Black).
    *   **Terminal:** `xterm.js` with `xterm-addon-fit` for responsive resizing.
    *   **Voice:** Native Web Speech API for low-latency STT and TTS.
    *   **Icons:** Lucide React.
    *   **Communication:** `socket.io-client`.

*   **Backend (Server):**
    *   **Runtime:** Node.js (Express).
    *   **Shell Management:** `node-pty` spawns a persistent shell process (`powershell.exe` on Windows).
    *   **Transport:** `socket.io` pipes `stdout` and `stdin` between the frontend and the PTY.
    *   **Safety:** Handles process cleanup and resize events.

### Key Components

#### 1. PTYService (`server/services/PTYService.js`)
Wraps `node-pty` to manage the shell lifecycle. It enables real-time streaming of terminal data, preserving ANSI colors and formatting.

#### 2. Terminal Component (`client/components/Terminal.tsx`)
Encapsulates `xterm.js`. It handles:
- Rendering ANSI output from the backend.
- Capturing user keystrokes and sending them to the backend.
- Auto-fitting dimensions on window resize.

#### 3. Voice Controls (`client/hooks/useVoice.ts`)
A custom hook that interfaces with `window.SpeechRecognition`.
- **Input:** Captures speech, converts to text, and sends it to the terminal as a command upon silence.
- **Output:** "Auto-Read" feature (toggleable) strips ANSI codes from terminal output and speaks the clean text using `speechSynthesis`.

## Usage
Run the entire stack with a single command from the root:
```bash
node start-all.js
```
This launches the backend on port 3001 and the frontend on port 5173.
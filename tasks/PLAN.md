# Plan: Gemini Station - True GUI

## Phase 1: Dynamic Status & Context Awareness
- [ ] **Directory Sync:** Implement a dynamic directory path in the footer that updates automatically.
- [ ] **Active Task Tracker:** Detect when long-running processes (like `npm run dev` or a blueprint implementation) are active and show a "Processing..." status in the dashboard.
- [ ] **Project Info:** Fetch and display project metadata (e.g., version, git branch) on the home dashboard.

## Phase 2: Intelligent Output Parsing (Logic Bridge)
- [ ] **Regex Parser:** Create an `OutputParser` to identify common CLI patterns in the stream.
- [ ] **Visual Progress:** Convert text-based progress bars (e.g., `[====>    ] 50%`) into smooth, animated GUI progress components.
- [ ] **Interactive Elements:** Make file paths, URLs, and Git hashes in the chat bubbles clickable to open them or perform actions.
- [ ] **Error Highlights:** Automatically detect stack traces or "ERROR" keywords and highlight them with distinct visual cards.

## Phase 3: Audio Engine Expansion
- [ ] **Sound Library:** Integrate a set of subtle, high-end sound effects for system events.
- [ ] **Smart Notifications:** 
    - Play a "Success" chime when a command exits with code 0.
    - Play an "Alert" sound when a process fails.
- [ ] **Voice Logic:** Ensure TTS (Narrator) doesn't interrupt itself and handles long outputs gracefully (e.g., summarizing long logs).

## Phase 4: Full Capability GUI
- [ ] **Extension Discovery:** Dynamically populate the Extension Grid by scanning the current environment for available tools.
- [ ] **Smart Command Routing:** When a user types a command in the chat, visually suggest the corresponding Extension Panel if one exists.
- [ ] **Quick-Action Sidebar:** Finalize the sidebar with "Session History" and "Frequent Tools" for one-click access.

## Phase 5: Session Persistence & Health
- [ ] **Re-attachment Logic:** Ensure the Backend PTY persists even if the browser tab is closed/refreshed, allowing the user to pick up where they left off.
- [ ] **System Monitor:** Add a small CPU/Memory usage indicator to the footer to track the health of the background processes.
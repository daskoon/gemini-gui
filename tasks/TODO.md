# Todo: Gemini Station - True GUI

## Phase 1: Dynamic Status & Context Awareness
- [ ] Implement Directory Sync in Footer `[frontend]` `[backend]`
  - [ ] Update `PTYService` to emit current working directory (CWD) changes. `[backend]`
  - [ ] Create socket event listener for CWD updates in client. `[frontend]`
  - [ ] Update Footer component to display dynamic CWD. `[frontend]`
- [ ] Implement Active Task Tracker `[frontend]` `[backend]`
  - [ ] Add logic to `PTYService` to detect active child processes. `[backend]`
  - [ ] Create visual indicator component in Dashboard for "Processing..." status. `[frontend]`
- [ ] Implement Project Info Display `[frontend]` `[backend]`
  - [ ] Create service to fetch `package.json` version and `git branch` info. `[backend]`
  - [ ] Display metadata on Home Dashboard. `[frontend]`

## Phase 2: Intelligent Output Parsing (Logic Bridge)
- [ ] Create Output Parser Logic `[frontend]`
  - [ ] Implement regex patterns for CLI progress bars. `[logic]`
  - [ ] Implement regex patterns for file paths, URLs, and git hashes. `[logic]`
  - [ ] Implement regex patterns for Error/Warning keywords. `[logic]`
- [ ] Implement Visual Progress Components `[frontend]`
  - [ ] Create `ProgressBar` component (animated). `[ui]`
  - [ ] Integrate parser with Chat Interface to render `ProgressBar` instead of text text. `[integration]`
- [ ] Implement Interactive Elements `[frontend]`
  - [ ] Create `ClickableLink` component for URLs/Files. `[ui]`
  - [ ] Add click handlers to open files/links (requires backend support for opening files). `[fullstack]`
- [ ] Implement Error Highlighting `[frontend]`
  - [ ] Create `ErrorCard` component for stack traces. `[ui]`
  - [ ] Apply styling for error blocks in chat stream. `[ui]`

## Phase 3: Audio Engine Expansion
- [ ] Integrate Sound Library `[frontend]`
  - [ ] Source or generate sound assets (success, error, notification). `[assets]`
  - [ ] Create `SoundManager` utility class. `[logic]`
- [ ] Implement Smart Notifications `[frontend]`
  - [ ] Hook into socket events for command completion/exit codes. `[logic]`
  - [ ] Trigger success/error sounds based on exit code. `[logic]`
- [ ] Refine Voice Logic (TTS) `[frontend]`
  - [ ] Implement queue system for TTS to prevent overlapping. `[logic]`
  - [ ] Add logic to summarize/truncate long output before reading. `[logic]`

## Phase 4: Full Capability GUI
- [ ] Implement Dynamic Extension Discovery `[backend]`
  - [ ] Scan project directories for extension-specific files (e.g., `gemini-extension.json`). `[backend]`
  - [ ] API endpoint to return list of available extensions. `[backend]`
- [ ] Update Extension Grid `[frontend]`
  - [ ] Fetch extension list from new API. `[frontend]`
  - [ ] Render grid dynamically. `[frontend]`
- [ ] Implement Smart Command Routing `[frontend]`
  - [ ] Add auto-complete/suggestion logic to Chat Input. `[ui]`
  - [ ] Map typed commands to Extension IDs. `[logic]`
- [ ] Finalize Sidebar `[frontend]`
  - [ ] Implement "Session History" panel (mock or real persistence). `[ui]`
  - [ ] Implement "Frequent Tools" section. `[ui]`

## Phase 5: Session Persistence & Health
- [ ] Implement Re-attachment Logic `[backend]`
  - [ ] Ensure `node-pty` session is decoupled from socket connection. `[backend]`
  - [ ] Send history buffer to new client connections. `[backend]`
- [ ] Implement System Monitor `[fullstack]`
  - [ ] Add stats gathering (CPU/RAM) to backend. `[backend]`
  - [ ] Stream stats to frontend via socket. `[backend]`
  - [ ] Render mini-graph in Footer. `[frontend]`

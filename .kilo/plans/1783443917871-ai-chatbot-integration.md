# Integrate the AI Chatbot into the New Feature-Driven Architecture

## Context

The front-end is mid-migration from `src.legacy` (views/hooks/components) to a
feature-driven architecture under `src/features` + `src/components`. The **AI
chatbot** is the last feature that was never wired into the new app:

- `src/store/ChatbotProvider.tsx` (new) was created as a stub but is **never
  imported** anywhere in `src` (only `src/features/module-preview/routes.tsx`
  imports the *legacy* `ChatbotProvider`).
- The actual chatbot UI (`src.legacy/components/chatbot/*`), its hooks
  (`useChatbot`, `useChatbotUi`, `useChatbotQuiz`) and the quiz subsystem
  (`useCourseQuiz`, `QuizModal`, `use-diagnostic-quiz`, `useHttp`,
  `config/ai`) still live entirely in `src.legacy`.
- In legacy the chatbot was rendered globally at `root-layout.component.tsx`
  (`<ChatbotProvider><…><Chatbot/></ChatbotProvider>`, gated on `!isAiDisabled`).
  The new router (`App.router.tsx`) uses `AppWrapper` + `RouteGuard` and never
  renders `<Chatbot/>`, so **the chatbot is currently invisible in the new app**.

Agreed approach (user-confirmed): **Lightweight global mount** — reuse the
existing legacy `Chatbot` component globally in the new router, wrapped by a
single `ChatbotProvider`, consistent with how `module-preview` already
re-exports legacy `module-content-explorer`. No porting of the chatbot/quiz
subsystem internals. The `teacher` feature is explicitly out of scope.

## Missing-feature audit (the "last feature I didn't see")

Comparing legacy `src.legacy/views` against new `src/features`/`src/components`:

| Legacy view | New architecture | Status |
|---|---|---|
| login / register | `features/auth` | migrated |
| home/root-layout | `AppWrapper` + Chatbot mount (this task) | closed by this task |
| features-list | `features/dashboard/views/FeaturesList` | migrated |
| calendar | `features/calendar` | migrated |
| mediatheque | `features/mediatheque` | migrated |
| module | `features/module` | migrated |
| module-content-explorer | `features/module-preview` (re-exports legacy) | reachable |
| profile | `features/profile` | migrated |
| resources | `features/resources` | migrated |
| student | `features/dashboard` student routes | migrated |
| admin/* | split across admin features | migrated |
| teacher | — | **excluded by user** |

No other top-level view/feature is missing. The only genuinely unmigrated
*subsystem* is the **quiz/diagnostic-quiz** (used by both the chatbot and
`module-preview`), but it is intentionally kept alive via the legacy re-export
pattern and is not blocking. Flagged as future work, not part of this task.

## Implementation plan

### 1. Render the chatbot globally in the new router
In `src/App.router.tsx`:
- Import the legacy chatbot and provider:
  - `import Chatbot from "../../src.legacy/components/chatbot/chatbot";`
  - `import { ChatbotProvider } from "../../src.legacy/store/chatbotContext";`
  - `import { isAiDisabled } from "../../src.legacy/config/ai/ai";`
- Wrap the **admin** route group's `element` and the **student** route group's
  `element` with `<ChatbotProvider>` so the single provider wraps both the
  `AppWrapper` (and therefore `module-preview`) and the `<Chatbot/>` overlay:

  ```tsx
  element: (
    <ChatbotProvider>
      <AppWrapper sidebar={<Sidebar />} loader={<Loader />}>
        <RouteGuard allowedRanks={[ROLES_RANKS.SUPER_ADMIN, ROLES_RANKS.ADMIN]} />
      </AppWrapper>
      {!isAiDisabled && <Chatbot />}
    </ChatbotProvider>
  )
  ```
  Do the equivalent for `studentRoutes` (keep `ConfettiWrapper` inside).
- `ChatbotProvider` uses `useLocation`, which is valid here because the element
  is rendered inside `RouterProvider`. Because only one route group mounts at a
  time, one provider instance per group is enough; the global `<Chatbot/>` and
  `module-preview` share that provider's context.

### 2. Remove the redundant per-route ChatbotProvider in module-preview
In `src/features/module-preview/routes.tsx`, the `wrapModulePreview` helper
wraps `ModulePreview` in a **separate** `ChatbotProvider`. If left in place, the
`currentActivity` set inside `module-preview` (via `use-module-content-explorer`,
tiptap editor, etc.) would update the *inner* provider, invisible to the global
`<Chatbot/>`, breaking quiz triggering and activity context.
- Change `wrapModulePreview` to just `withSuspense(ModulePreview)` and drop the
  `ChatbotProvider` import there, so module-preview uses the single group-level
  provider from step 1.

### 3. Delete the unused new stub
- Delete `src/store/ChatbotProvider.tsx`. It duplicates the legacy
  `src.legacy/store/chatbotContext` and is referenced by nothing in `src`. The
  legacy module is now the single source of truth for `ChatbotContext`
  (which the legacy `Chatbot` and all its hooks already import).

### 4. Verify dependency reachability (no code change)
The legacy `Chatbot` pulls in `useHttp`, `useCourseQuiz`, `QuizModal`,
`ai-texts.json`, `isAiDisabled` — all under `src.legacy`, already bundled
because `module-preview` re-exports legacy `module-content-explorer`. Confirm no
new import errors appear at build.

## Edge cases / risks
- **Auth flashing:** `<Chatbot/>` is a sibling of `AppWrapper`; `RouteGuard`
  redirects unauthenticated users, so the chatbot won't persist on the login
  page. Acceptable; optional hardening is to also gate on auth if needed.
- **`forceHideChatbot`** (set by legacy `use-diagnostic-quiz` inside
  `module-preview`) uses the legacy `ChatbotContext` — now the same provider as
  the global chatbot, so hiding during diagnostic quizzes works correctly.
- **`VITE_DISABLE_AI_FEATURES`**: when `"true"`, `isAiDisabled` is true and the
  chatbot is not rendered (matches legacy behavior).

## Validation
1. `npm run lint` (eslint, `--max-warnings 0`) — must pass with no unused import
   after deleting the stub.
2. `npm run build` (vite) — must compile (no broken imports).
3. Manual / dev (`npm run dev`):
   - Log in as student → chatbot button visible bottom-right; open it, send a
     prompt, confirm streaming reply and sources.
   - Open a module preview (`/student/parcours/module/:id`), scroll content →
     after the read-time timer the quiz suggestion appears and the quiz modal
     opens; `forceHideChatbot` hides the chatbot during the diagnostic quiz.
   - Set `VITE_DISABLE_AI_FEATURES=true` → chatbot does not render.
   - Confirm no duplicate/second chatbot instance appears (only one provider).

## Out of scope / follow-up
- Full port of the chatbot UI + quiz/diagnostic subsystem to `src/features`
  (would require migrating `useHttp`→axios/react-query, `useCourseQuiz`,
  `QuizModal`, `use-diagnostic-quiz`). Track separately if desired.
- `teacher` feature migration (excluded per user).

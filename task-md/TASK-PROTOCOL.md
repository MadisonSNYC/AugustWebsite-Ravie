# 🔐 Task-MD Protocol (Source of Truth)

This file (`task-md/TASKS.md`) is the **single source of truth** for all project tasks.  
- All task entries must live here, at a high-level (phases, branch, verification).  
- Detailed implementation plans belong in separate files beside this one: `task-md/<task-slug>-plan.md`.  
- No duplicate or alternate Task-MDs may be created.  

---

## Session Rules

### URL Reporting Rule
**ALWAYS provide full URLs when reporting updates or changes:**
- When a feature is updated, provide: `http://localhost:[PORT]/[route]` to check
- When a file is modified, provide the full path: `/Users/.../portfolio-migration/portfolio-migration-package/src/[file]`
- Include what specifically changed and where to verify it visually
- Example: "Navigation updated - check http://localhost:8000/work to see counter-scroll with new nav overlay"

---

## Workflow Rules

### 1. Task Initialization
- Always create a **new branch** named for the task (`feat/<slug>`, `fix/<slug>`, `chore/<slug>`).
- Document the branch in this file under the task’s entry.
- Create a `*-plan.md` file beside this one for implementation details.
## 🔁 Component Safe-Space Replacement Protocol (Main Codebase — Live Build, Old Preserved)

**Purpose**  
Build or replace a core UI (header, footer, hero, etc.) **live** while keeping the prior implementation **safe, restorable, and referenceable**. Avoid duplication and keep rollback trivial.

**Rules**  
- **No deletions**: move prior implementation to `_archive/` (e.g., `src/components/<area>/_archive/<name>/…`).
- **No duplicates**: any shared logic/data must be extracted into `src/components/<area>/_shared/` (hooks, tokens, a11y helpers, data/model sources).
- **CSP/A11y/Perf (non-negotiable)**:
  - **CSP**: no `unsafe-inline` styles/scripts in production; use Tailwind, classes, or CSS Modules.
  - **A11y**: keyboardability, ARIA roles/labels, `prefers-reduced-motion` fallbacks.
  - **Perf**: aim ~60fps; zero CLS; avoid layout thrash/reflows; bundle deltas kept small.

**Process**  
1) **Archive prior implementation**  
   - Move all old components/styles to `_archive/<name>/…`.  
   - Do **not** re-export archived files from public indices to avoid accidental mounting.
2) **Scaffold new variant live**  
   - Place new code under `src/components/<area>/<variant>/…`.  
   - Extract any common logic into `_shared/` (e.g., `use<Area>State.ts`, `<area>.tokens.ts`, `<area>.a11y.ts`, data hooks).
   - Use CSS Modules/Tailwind for isolation (CSP-safe).
3) **Update layout** to render the new variant.  
   - Keep the archived version available for rapid rollback.
4) **Optional, deferred**: add a tiny **commented** dev override snippet in the layout to render the archived version via a URL param for demos (e.g., `?old=<name>`). Do **not** enable unless requested.

**Rollback**  
- One-liner: either point the layout at `_archive/<name>/…` or restore the pre-change tag/commit.

---

### ⏱️ Phase-Level Gates (applies to **every** phase in **every** task/feature)

1) **Performance Pre-Check (analysis only)**  
   - Summarize FPS/CPU, re-render / layout thrash risk, bundle/asset concerns, CSP risks.  
   - **No code changes** during Pre-Check.
2) **Madison Verification**  
   > "Madison, please verify this phase is correct. Yes/No"
3) **If YES → Push & Log**  
   - Push to the current branch; return **short commit SHA**.  
   - Update `TASKS.md` (this phase): **Verification=YES**, **Push Log**, **Date/Time Confirmed (YYYY-MM-DD HH:mm ET)**.  
4) **If NO → Stop**  
   - Do not push. Log blockers/questions; await guidance.
5) **Issues & Spin-off Tasks**  
   - If issues arise mid-phase, add them under this phase and open a new task/branch with its own plan; cross-link both directions.

---

## 📁 Task Completion & Archival Protocol

### **When to Archive a Task**
- All phases completed and verified by Madison
- Final commit pushed and documented in TASK.md
- No remaining issues or spin-off tasks
- Task is considered production-ready

### **Archival Process**
1) **Create archive copy**:
   ```bash
   cp task-md/[task-name]-plan.md task-md/archived-tasks/[task-name]-plan-COMPLETED.md
   ```
2) **Add completion metadata** to archived file:
   - Final commit SHA and branch
   - Completion date and time
   - Total phases completed
   - Performance outcomes achieved
   - Any lessons learned or improvements noted
3) **Update archived task references** in TASK.md:
   - Change status to "ARCHIVED"
   - Add archive location reference
   - Preserve all phase completion data
4) **Keep original plan** for reference until next major milestone

### **Archive Directory Structure**
```
task-md/
├── archived-tasks/
│   ├── [TaskName]-Plan-COMPLETED.md
│   ├── [TaskName]-Plan-COMPLETED.md
│   └── README.md (archive index)
├── [active-task]-plan.md
├── TASK.md (current tasks)
└── TASK-PROTOCOL.md (this file)
```

### **Archive Metadata Template**
```markdown
# [ARCHIVED] Task Name - COMPLETED
**Completion Date:** YYYY-MM-DD HH:mm ET
**Final Branch:** feat/[branch-name]
**Final Commit:** [short-SHA]
**Total Phases:** [number] phases completed
**Performance Achieved:** [key metrics]
**Lessons Learned:** [improvements for future tasks]

[Original plan content follows...]
```

---

## 🛑 Phase Pause & Governance (Protocol Promotion)

If a step changes scope materially (e.g., moving an old component to `_archive/`, introducing a new shared hook), the assistant must:

1) **Pause** work and post a summary to the chat:
   - What changed or is proposed
   - Why it’s necessary
   - Any risks
   - The exact phase where it occurs
2) Ask Madison to **review & approve** adding this rule or step into protocol.
3) Only after Madison’s **“Approved”** may the assistant proceed to apply or codify it.

### 2. Implementation
- Follow **coding best practices** listed below.
- **Preserve all working features** as top priority.
- If unexpected issues arise → **STOP** and report to Madison. Do not self-correct beyond scope.
- Only touch files/components within task scope.

### 3. Verification Gate (Critical — Phase Level)

- Verification occurs **after every phase or major element** (not just at task end).

**Per-phase process (repeat at each phase end):**
1) Document what was completed.
2) Run a **Performance Pre-Check** (analysis only; no code changes).
3) Ask Madison:
   > "Did Madison verify this phase is correct? Yes/No"
4) If **No** → stop and wait.
   If **Yes** → **push to the task branch** and record:
   - Branch name
   - Commit SHA (short)
   - Optional tag/annotation
5) Prompt Madison to confirm **date/time** for logging this phase in `TASKS.md`.

**Issues & Spin-off Tasks**
- If any issue arises during a phase (legacy code, conflicts, regressions):
  - Log it under that phase's **Issues & Spin-off Tasks** in `TASKS.md`.
  - Create a new task entry (with its own branch and `*-plan.md`).
  - Cross-link both directions (from the current phase and the new task's entry).

**Rules**
- No phase is considered complete until Madison explicitly says **Yes**.
- Do not bundle multiple phases without verification.
- Do not push/merge for any phase until Madison confirms **Yes**.  


### 4. Performance Pre-Check
Before marking a task complete, document findings here:
- Look for duplicate/unnecessary API or DB calls (N+1, waterfalls).
- Identify components re-rendering too often or doing heavy work.
- Check bundle size and asset optimization.
- Recommend caching, memoization, lazy loading, code-splitting, compression where needed.
- Output the findings in the task’s entry as a bullet list.  
**No code changes at this step — just analysis.**

### 5. Documentation
Each task entry in this file must include:
- Task name & branch
- Phases (Plan → Build → Verify → Merge)
- Verification status (Yes/No)
- Performance notes
- Cross-feature risks
- Link to its `*-plan.md`

---

## Code Organization & File-Size Caps
- **Target file length:** ≤ 200 lines. Split files if larger (UI vs hooks vs helpers).
- **Max function length:** ~60 lines.
- **One file = one responsibility** (container vs presentational).
- Shared/atomic components live under `src/shared/` or `src/components/_shared/`.
- **No new top-level folders** without rationale logged in `TASKS.md`.

### Canonical project tree
src/
app/ # app shell, routing, providers
components/ # reusable UI blocks
header/ # feature-specific subcomponents
_shared/ # cross-feature atoms/molecules
features/ # feature slices (api, hooks, ui per feature)
hooks/ # generic React hooks
lib/ # utilities (no React)
pages/ # thin route components
styles/ # Tailwind config/custom styles
assets/ # images, fonts (optimized)
tests/ # e2e/integration (or colocated)
task-md/
TASKS.md # source of truth
<task-slug>-plan.md

---

## Best Practices

### Critical Changes
- Carefully examine all related code before edits.
- Do not touch unrelated files.
- If unsure, pause and explain before continuing.
- Test thoroughly after each change.

### Error Fixing
- Fix only relevant code sections.
- Trace errors to the root cause.
- Validate the fix resolves the issue without regressions.

### Code Modification
- Surgical diffs only; preserve naming conventions and architecture.
- Improvements beyond scope should be logged separately.

### Solution Verification
- Rigorous tests before confirming: issue resolved, no regressions, perf stable.

### Code Consistency
- Follow existing styles, naming, and error-handling approaches.

### Dead Code Elimination
- Remove unused code only after confirming it’s safe.
- No commented-out or orphaned blocks.

### UI/UX Consistency
- Respect design system, spacing, states, theming, and accessibility.
- Test keyboard nav and screen readers.

### Performance Optimization
- Cache repeated calls.
- Memoize expensive renders.
- Code-split, lazy load, and optimize assets.
- Aim for LCP <2.5s, CLS <0.1, smooth 60fps.

---

## README Requirements
The top-level `README.md` must always include:
1. **Quickstart:** prereqs, scripts (`dev`, `build`, `lint`, `test`).
2. **Codebase tour:** explain tree and 200-line rule.
3. **Conventions:** branch naming, commit style, testing approach, a11y standards.
4. **Task-MD workflow:** source-of-truth rules, verification gate.
5. **Performance doctrine:** how to profile and record findings.
6. **Security & assets policy:** CSP-safe CSS/JS, asset compression.
7. **FAQs/gotchas:** common pitfalls.

---
# 📅 Task Session Summary (Protocol)

**Date/Time:** To be confirmed by Madison at end of task.  
*(Assistant must explicitly ask: “Madison, please confirm the correct date and time for this task entry.”)*

---

## Active Task Entry (High-Level Only)
- Task: [short title]  
- Branch: [branch-name]  
- Plan File: `task-md/[slug]-plan.md`  
- Phases: Plan → Build → Verify → Merge  
- Verification: Pending / Madison Verified: YES  
- Performance Notes: [summary bullets]  
- Risks: [cross-feature risks]  

---

### ⏱️ Date/Time Confirmation Workflow
- At the end of each task cycle (before logging the entry here), assistant must ask Madison to confirm:  
  1. **Date** (YYYY-MM-DD)  
  2. **Time** (with timezone if relevant)  
- Only after Madison confirms should the assistant finalize the entry in `TASKS.md`.  

---

## Example Entry
Task: Implement Header

Branch: feat/header
Plan: task-md/header-plan.md
Phases: Plan → Build → Verify → Merge
Verification: Pending (awaiting Madison)
Performance Notes:

Header re-renders on every route → consider memoizing subcomponents

Two duplicate user fetches → dedupe with caching
Risks: affects global layout/navigation

# 📄 Task Plan Template (`*-plan.md`)

Each individual task should have its own plan file following this structure.  
Use this to document implementation details, risks, and QA.  

---

## Steps
- [ ] List step-by-step actions to implement the task.  
- [ ] Keep diffs **surgical** (only what’s necessary).  
- [ ] Note any dependencies or linked files.  
- [ ] Reference architectural decisions if relevant.  

---

## Risks & Constraints
- Identify components/features at risk of being affected.  
- Call out **cross-feature dependencies**.  
- Highlight areas where regressions are most likely.  
- Mention **file-size risks** (if nearing 200 lines).  

---

## QA / Verification Checklist
### Functional
- [ ] All user interactions tested.  
- [ ] No broken flows introduced.  

### Responsive
- [ ] Verified on mobile, tablet, desktop.  

### Accessibility
- [ ] Keyboard navigation works.  
- [ ] ARIA roles and labels tested.  
- [ ] Honors `prefers-reduced-motion`.  

### Performance
- [ ] No duplicate fetches or N+1 calls.  
- [ ] Components not over-rendering.  
- [ ] Bundle/asset size unchanged or reduced.  
- [ ] FPS smooth at 60 during interactions.  

### Security
- [ ] CSP compliance (no unsafe-inline).  
- [ ] Auth/session logic unaffected.  

### Regression
- [ ] Other stable features verified as intact.  

---

## Verification
- Madison Review: **Pending / Yes / No**  
- Notes from review:  

# 📝 Pull Request

## What / Why
- [ ] Describe the purpose of this PR.
- [ ] Link to relevant `*-plan.md` or `TASKS.md` entry.

---

## Scope of Changes
- [ ] Files changed (list paths).
- [ ] Functions/components touched.
- [ ] No unrelated files modified.

---

## Verification
- [ ] Madison has reviewed and approved before merge.
- [ ] Verification status: **Pending / Yes**

---

## QA Checklist

### Functional
- [ ] Feature works as intended.
- [ ] No broken flows.

### Responsive
- [ ] Tested on mobile, tablet, desktop.

### Accessibility
- [ ] Keyboard navigation.
- [ ] ARIA roles/labels.
- [ ] Respects `prefers-reduced-motion`.

### Performance
- [ ] No duplicate fetches/N+1.
- [ ] No unnecessary re-renders.
- [ ] Bundle size unchanged/reduced.
- [ ] Smooth 60fps interactions.

### Security
- [ ] CSP safe (no unsafe-inline).
- [ ] No auth/session regressions.

### Regression
- [ ] Stable features verified as intact.

---

## Screenshots / Recordings
_Attach before/after UI evidence._

---

## Notes
_Any edge cases, risks, or follow-ups._

## 🗂️ Repo Context & Branching Rules

All main codebase work must happen in this repo:

**Main Codebase Repo (default):**  
https://github.com/MadisonSNYC/AugustWebsite-Ravie

### Rules
1. **Repo confirmation before any push**
   - Assistant must always confirm:  
     > “Which repo am I in for this task? Main Codebase vs Sandbox?”
   - If context is unclear, stop and ask Madison.
   - Do not assume repo context.

2. **Branch creation**
   - Branches must always be created from the **main codebase repo** at:  
     `https://github.com/MadisonSNYC/AugustWebsite-Ravie`
   - Use branch naming:  
     - Features → `feat/<slug>`  
     - Fixes → `fix/<slug>`  
     - Refactors → `refactor/<slug>`  
     - Chores → `chore/<slug>`

3. **Sandbox work**
   - Sandbox repo (e.g., ravie-sandbox) is only used for **isolated experiments**.  
   - Sandbox tasks must be logged with `Repo: Sandbox` in `TASKS.md`.  
   - No pushes to the main repo from sandbox branches.  
   - Graduation requires a separate **integration task** in the main repo.

4. **TASKS.md entries must include repo**
   - Example:
     ```
     ### Task: Header Safe-Space Replacement
     **Repo:** Main Codebase (AugustWebsite-Ravie)
     **Branch:** feat/header
     **Plan:** task-md/header-plan.md
     ```

5. **Push verification**
   - Do not push code until:
     - Repo context is confirmed
     - Branch name is correct
     - Madison has verified the phase
     - Short SHA is logged in `TASKS.md`

---

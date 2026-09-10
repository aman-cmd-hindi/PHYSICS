# Comprehensive Architecture, Security, and Quality Audit
**Maharashtra Board Physics Learning + Classroom Platform**
**Date:** September 2026

---

## 1. Current Architecture Overview

The application is a Next.js (App Router) project built with TypeScript, TailwindCSS, Lucide icons, and optional Supabase integration for authentication and cloud persistence. It is designed for Maharashtra State Board Class 12 Physics.

- **Frontend & App Shell:** Next.js 14+ with routes organized under `app/(dashboard)` and `app/auth`.
- **Content Hierarchy:** Board → Class → Stream → Exam → Subject → Chapter → Topic → Lesson → Lesson Blocks. Currently, official chapter metadata is provided in `content/manifest.ts` (16 chapters), along with verified formulas in `content/data/formulas.ts` and PYQs in `content/data/pyqs.ts`.
- **Offline / Storage:** Hybrid storage model using `LocalStorageAdapter` and `SupabaseStorageAdapter` managed via `lib/storage` and `lib/offline`.
- **Formula Lab:** Interactive canvas and mathematical calculation engine for core physics formulas.
- **Classroom / Smart Board Mode:** Specialized tutor view with slide decks and 2D canvas simulation labs.
- **Testing:** Vitest test suite (`npm test`) and TypeScript strict typechecking (`npm run typecheck`).

---

## 2. Existing Functionality

1. **Dashboard & Navigation:** Responsive sidebar, navigation across 16 chapters, formulas, PYQs, labs, notes, bookmarks, revision engine, tests, settings, and tutor classroom mode.
2. **Deterministic Physics Engines:**
   - Formula models with LaTeX, variables, physical meanings, and derivations.
   - PYQ bank with marks (1, 2, 3, 4 marks), year, marking schemes, and model answers.
   - 2D Canvas simulations for Rotational Dynamics (Torque, Centripetal force, etc.).
   - Spaced repetition and weak-topic recovery calculation engine.
3. **Curriculum Manifest:** All 16 Maharashtra Board Class 12 Physics chapters with official marks weightage and topics counts.

---

## 3. Defects & Critical Non-Negotiable Violations

### Critical Defect 1: Student-Facing AI / LLM Calls
- **Issue:** `/practice` route and `app/api/gemini/generate/route.ts` expose a live Gemini API integration directly to learners for generating questions, derivations, and practice questions.
- **Violation:** Violates Non-Negotiable Rules #2, #3, #4 ("NO AI/Gemini/OpenAI/LLM calls are allowed anywhere in student-facing routes, components, APIs, server actions, loaders, hooks, or learning engines. Student practice must use verified database/content-package questions. If there are no verified questions available, show: 'Verified practice content is not available yet.'").

### Critical Defect 2: Client-Controlled Role Selection on Signup & Insecure Authorization
- **Issue:** `app/auth/signup/page.tsx` allows the browser to select `role` ("student" or "tutor") and sends it directly via Supabase Auth metadata `data: { role }`. `supabase/migrations/00001_initial_schema.sql` consumes `COALESCE(NEW.raw_user_meta_data->>'role', 'student')`.
- **Issue:** `middleware.ts` merely refreshes sessions and does not protect `/admin/**` or `/tutor/**` server-side.
- **Violation:** Violates Non-Negotiable Rules #13, #14, #15, #16 ("Student signup must NOT accept a role from the browser. Normal signup: role = student. Tutor/admin roles can only be granted through protected server-side administration. Protect routes server-side /admin/**, /tutor/**. A user must receive HTTP 401/403 or an equivalent protected response when unauthorized.").

### Critical Defect 3: Fake Offline Download Progress & Incomplete Offline Storage
- **Issue:** `lib/offline/chapter-downloader.ts` uses `setTimeout()` and fake progress steps:
  ```ts
  if (onProgress) onProgress(20);
  await new Promise((r) => setTimeout(r, 100));
  if (onProgress) onProgress(60);
  await new Promise((r) => setTimeout(r, 100));
  ```
  It simply writes chapter IDs to localStorage without caching any chapter content, lessons, formulas, or questions.
- **Violation:** Violates Non-Negotiable Rules #11, #12, and Requirement D ("Do not use setTimeout(), mock promises, fake download progress, fake sync. Do not claim 'Downloaded' unless the actual content is locally available. Implement real local-first storage: IndexedDB / browser storage caching lessons, questions, formulas, download manifest, verification, deletion.").

### Critical Defect 4: Simplistic/Incomplete Sync Queue
- **Issue:** `lib/offline/sync-manager.ts` pushes simple objects to `localStorage` without mutation ID, user ID, entity ID, operation, client version/timestamp, sync status, retry count, failure handling, or idempotency keys.
- **Violation:** Violates Requirement E ("Durable offline mutation queue with mutation ID, user ID, entity ID, operation, payload, timestamp, client version, sync status, retry information, idempotency, server acknowledgement").

### Critical Defect 5: Unsafe / Ad-Hoc Formula Lab Expression Evaluation
- **Issue:** `FormulaLabBlock` in `content/types/course.ts` has `calculateFnBody: string`. In `LessonRenderer.tsx`, formula calculation fallback is hardcoded (`reduce((acc, curr) => acc * curr, 1)`), and dynamic execution risks introducing `eval()` / `new Function()` in authoring.
- **Violation:** Violates Requirement F ("Do NOT execute arbitrary JavaScript received from content. Do NOT use eval() or new Function(). Create a safe equation definition system, mathematical expression evaluator or whitelist-based AST/operation tree with domain, units, and division-by-zero validation.").

### Critical Defect 6: Incomplete Textbook Viewer State
- **Issue:** `app/(dashboard)/textbook/page.tsx` and `components/textbook/TextbookViewer.tsx` lacked an explicit typed `CONTENT_REQUIRED` / authorized asset check and Smart Board zoom controls for authorized assets.
- **Violation:** Violates Requirement G & J ("If the actual authorized textbook asset is not available, show a content-required state. Never generate fake textbook pages.").

### Critical Defect 7: Content Studio Lifecycle & Persisted Human Verification
- **Issue:** `app/(dashboard)/admin/page.tsx` only had a transient React state `const [humanVerified, setHumanVerified] = useState(false)` with no persisted server-side audit record, change reason, reviewer ID, version transition, or lifecycle state machine (`DRAFT` → `VALIDATION` → `HUMAN_REVIEW` → `APPROVED` → `PUBLISHED` → `ARCHIVED`).
- **Violation:** Violates Requirement H ("Turn the current UI shell into a real protected content workflow. Required lifecycle: DRAFT → VALIDATION → HUMAN REVIEW → APPROVED → PUBLISHED → ARCHIVED. Human verification must be persisted server-side. A React boolean such as humanVerified = true is NOT sufficient.").

---

## 4. Security Risks Identified

1. **Privilege Escalation:** Anyone could sign up as a `tutor` or manipulate request metadata to gain privileged access.
2. **Missing Server-Side Guards:** Direct visits to `/admin` or `/tutor` were not validated against authenticated user roles in middleware or server components.
3. **Client-Side Secret Exposure Potential:** Unrestricted Gemini route allowed unauthenticated arbitrary calls.
4. **Data Tampering & Unvalidated Mutations:** Mutations in progress and sync queues lacked server-side payload validation and idempotency tokens.

---

## 5. Incomplete Features / Placeholder Inventory

- `/practice` page relied on external AI generation instead of verified offline questions.
- `ChapterDownloader` was a timer-based mock.
- Real content hierarchy for Lesson Blocks needed complete deterministic rendering and explicit `CONTENT_REQUIRED` states for missing syllabus packages.
- Admin AI assistant was not wired to the strict human-in-the-loop review workflow.

---

## 6. Files Affected & Action Plan

| File | Action / Changes Planned |
|------|--------------------------|
| `app/(dashboard)/practice/page.tsx` | Remove all Gemini/AI integrations. Replace with verified curriculum question bank and deterministic practice engine. Show "Verified practice content is not available yet" when questions are missing. |
| `app/api/gemini/generate/route.ts` | Delete or move to protected `/api/admin/content-studio/ai-draft` with strict admin authentication and non-publishing restrictions. |
| `app/auth/signup/page.tsx` | Remove role selection UI completely. Hardcode signup role to `student` on the server. |
| `supabase/migrations/00001_initial_schema.sql` + `00002_rbac_and_content_lifecycle.sql` | Enforce role defaults to `student` server-side, create server-managed roles table/functions, add content review & sync audit schema. |
| `lib/supabase/database.types.ts` | Update roles to `'student' | 'tutor' | 'admin' | 'content_manager'`, add content lifecycle types and sync mutation types. |
| `middleware.ts` / `lib/supabase/middleware.ts` | Enforce server-side route protection for `/admin/**` and `/tutor/**` with 401/403 redirects. |
| `lib/offline/indexeddb-storage.ts` | [NEW] Real local-first storage using browser IndexedDB for chapters, lessons, questions, formulas, download manifests, and verification. |
| `lib/offline/chapter-downloader.ts` | Replace `setTimeout` with real manifest-based packaging, verification checksum, and offline storage. |
| `lib/offline/sync-queue.ts` | Real durable offline mutation queue with mutation ID, user ID, entity ID, operation, payload, timestamp, status, retry count, and idempotency. |
| `lib/formula-lab/safe-evaluator.ts` | [NEW] AST/whitelist mathematical expression parser and evaluator with division-by-zero, domain, and unit checks (no `eval` or `new Function`). |
| `components/formula/FormulaLab.tsx` | Connect to safe expression evaluator. |
| `content/types/course.ts` & `content/types/hierarchy.ts` | Support full content hierarchy (Board → Class → Stream → Exam → Subject → Chapter → Topic → Lesson → Blocks) with stable IDs. |
| `components/textbook/TextbookViewer.tsx` | Deterministic authorized viewer with explicit `CONTENT_REQUIRED` state, zoom, and Smart Board controls. |
| `features/content-studio/**` & `app/(dashboard)/admin/page.tsx` | Implement full content lifecycle state machine (`DRAFT` → `VALIDATION` → `HUMAN_REVIEW` → `APPROVED` → `PUBLISHED` → `ARCHIVED`) with persisted reviewer audit trail. |
| `tests/**` | Add unit and integration tests covering RBAC, safe formula evaluator, real offline storage/sync queue, content lifecycle, and deterministic practice. |

---

## 7. Required Tests

1. **Deterministic Practice & AI Isolation Test:** Verify no student routes call AI and verified questions are returned or appropriate unavailable state shown.
2. **Security & RBAC Test:** Verify signup forces `student` role, unauthorized access to `/admin` and `/tutor` is blocked, and RLS policies isolate records.
3. **Safe Formula Evaluator Test:** Verify mathematical evaluations (e.g. $T = 2\pi\sqrt{L/g}$, $\tau = r F \sin\theta$) calculate accurately, division by zero returns descriptive error, and arbitrary code injection is rejected without using `eval()`.
4. **Offline Storage & Sync Queue Test:** Verify IndexedDB/durable queue enqueues mutations with proper metadata, handles retries, idempotency, manifest verification, and offline chapter loading.
5. **Content Lifecycle & Audit Test:** Verify transitions through `DRAFT` → `VALIDATION` → `HUMAN_REVIEW` → `APPROVED` → `PUBLISHED` require human verification metadata and timestamps.

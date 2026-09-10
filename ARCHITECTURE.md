# Architecture

## 1. High-Level Architecture
```text
Student / Tutor Browser
        ↓
App Shell + Course Engine
        ├── Lesson Renderer
        ├── Question Engine
        ├── Numerical Engine
        ├── Formula Lab / Simulation Engine
        ├── PYQ / Test Engine
        ├── Revision / Analytics
        └── Offline Cache + Progress Store
                    ↓
              Optional Cloud Sync

Admin / Content Studio
        ↓
Source Ingestion → Draft → Verification → Preview → Approval → Publish
```

## 2. Content Model
```text
Board
└── Class
    └── Stream
        └── Exam
            └── Subject
                └── Chapter
                    └── Topic
                        ├── Lesson blocks
                        ├── Formula / derivation
                        ├── Formula Lab
                        ├── Questions
                        ├── Numericals
                        ├── PYQs
                        ├── Textbook page references
                        └── mastery rules
```

## 3. Reusable Engines
### Lesson Engine
Renders structured blocks rather than PPT files.

### Simulation Engine
Configuration-driven variables + validated equations + visualization + prediction prompts.

### Question Engine
Supports MCQ, conceptual, numerical, PYQ and adaptive practice.

### Progress Engine
Stores stable IDs for chapter/topic/block/question state and last resume position.

## 4. Roles
Student and Tutor consume the same published course package. Tutor permissions alter interaction behavior, not the underlying curriculum.

Admin controls content lifecycle and publishing.

## 5. Offline
Cache published course packages locally. Store progress mutations locally. Queue sync operations and reconcile after reconnect.

## 6. Classroom Mode
Smart Board optimized:
- full screen
- large touch targets
- high readability
- Previous / Topic position / Next
- minimal distractions
- touch-friendly simulations.

## 7. Textbook Reference
Store exact chapter/topic-to-page mappings. The viewer must use only authorized/licensed textbook content. Architecture must not assume redistribution rights.

## 8. Performance
Mobile-first, lazy-load heavy simulations, optimize media, progressive loading, minimal API requests and graceful slow-network behavior.

# Content Architecture

## 1. Source-to-Publish Pipeline
```text
Verified / Authorized Sources
        ↓
Content Ingestion
        ↓
Optional AI-assisted Draft
        ↓
Human Verification
        ↓
Content Studio
        ↓
Visuals + Formula Labs + Questions + Numericals + PYQs
        ↓
Preview
        ↓
Approval
        ↓
Versioned Publish
```

## 2. Chapter Package
Each chapter package contains:
- metadata
- official syllabus mapping
- ordered topics
- required formulas
- derivations
- definitions
- diagrams/graphs
- animations
- simulations
- Formula Labs
- integrated MCQs
- guided/semi-guided/exam numericals
- relevant PYQs
- important board points
- revision metadata
- textbook page references where authorized.

## 3. Topic Package
```text
Topic
├── Learning objectives
├── Lesson sequence
├── Visual assets
├── Formula / derivation
├── Formula Lab
├── Check Your Understanding
├── MCQs
├── Numericals
├── PYQs
├── Mastery rule
└── References
```

## 4. Quality Gates
Before publishing:
- syllabus coverage
- Maharashtra Board terminology/notation
- formula correctness
- unit correctness
- numerical answer validation
- diagram labels
- accessibility
- mobile performance
- simulation equation validation
- copyright/licensing check
- human approval.

## 5. Content Updates
Use immutable/stable content IDs and version mappings so updated lessons do not erase historical progress.

## 6. Textbook Mapping
Store topic → authorized textbook page/range. Actual page rendering must only use content the platform is legally authorized to host/display.

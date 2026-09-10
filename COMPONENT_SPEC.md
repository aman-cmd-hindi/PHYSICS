# Component Specification

## Core Components
- `AppShell`
- `Dashboard`
- `ChapterMap`
- `TopicOutline`
- `LessonRenderer`
- `LessonBlock`
- `FormulaBlock`
- `FormulaLab`
- `SimulationBlock`
- `DiagramBlock`
- `GraphBlock`
- `MCQBlock`
- `NumericalBlock`
- `PYQBlock`
- `MasteryGate`
- `ChapterTest`
- `PracticeEngine`
- `RevisionEngine`
- `AnalyticsPanel`
- `BookmarkPanel`
- `NotesPanel`
- `UniversalSearch`
- `OfflineDownload`
- `SyncManager`
- `TutorClassroomMode`
- `TextbookViewer`
- `ContentStudio`

## Lesson Block Types
Text, equation, definition, image/diagram, animation, interactive simulation, Formula Lab, example, prediction question, MCQ, numerical, PYQ, important board point and recap.

## Numerical Modes
### Guided
Given → Find → Formula → Substitution → Answer.

### Semi-Guided
Question/values → student selects formula and calculates.

### Exam
Question only → student solves in notebook and submits final answer; optionally support step checking.

## Tutor Controls
Show Question, Show Answer, Show Explanation, Reveal Solution, Previous, Next, Free Navigation, Full Screen, Reset Simulation and Run Simulation.

## Stable State IDs
Every chapter, topic, lesson block, question, numerical, PYQ and Formula Lab needs a stable unique ID so progress survives content updates.

## Smart Board Requirements
Minimum comfortable touch target sizing, large typography, full-screen operation, high contrast and minimal simultaneous controls.

## Content Authoring
Content Studio should compose lessons from structured blocks rather than require PPT runtime rendering.

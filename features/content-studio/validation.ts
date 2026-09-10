import { TopicPackage, LessonBlock } from "@/content/types/course";
import { ContentValidationError } from "./types";

export function validateTopicPackage(topic: TopicPackage): ContentValidationError[] {
  const errors: ContentValidationError[] = [];

  if (!topic.id || topic.id.trim().length === 0) {
    errors.push({ blockId: "topic", field: "id", message: "Stable topic ID is required." });
  }

  if (!topic.title || topic.title.trim().length === 0) {
    errors.push({ blockId: "topic", field: "title", message: "Topic title is required." });
  }

  if (!topic.blocks || topic.blocks.length === 0) {
    errors.push({ blockId: "topic", field: "blocks", message: "Topic must contain at least one lesson block." });
  }

  topic.blocks.forEach((block, idx) => {
    if (!block.id) {
      errors.push({ blockId: `block_${idx}`, field: "id", message: "Block is missing a stable ID." });
    }

    if (block.type === "mcq") {
      if (!block.question) errors.push({ blockId: block.id, field: "question", message: "MCQ question statement is required." });
      if (!block.options || block.options.length < 2) errors.push({ blockId: block.id, field: "options", message: "MCQ must have at least 2 options." });
      if (!block.hint) errors.push({ blockId: block.id, field: "hint", message: "MCQ must contain a pre-authored hint." });
      if (!block.explanation) errors.push({ blockId: block.id, field: "explanation", message: "MCQ must contain an explanation." });
    }

    if (block.type === "equation") {
      if (!block.latex) errors.push({ blockId: block.id, field: "latex", message: "Equation block requires valid LaTeX." });
    }

    if (block.type === "numerical") {
      if (!block.question) errors.push({ blockId: block.id, field: "question", message: "Numerical question statement is required." });
      if (!block.finalAnswer || block.finalAnswer.value === undefined) {
        errors.push({ blockId: block.id, field: "finalAnswer", message: "Numerical requires a verified final answer value." });
      }
    }
  });

  return errors;
}

import { TopicPackage } from "@/content/types/course";

/**
 * Authoritative Published Curriculum Packages for Maharashtra Board Class 12 Physics
 * Chapter 1: Rotational Dynamics
 */
export const PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC: TopicPackage = {
  id: "topic_rotational_01",
  chapterId: "ch_01_rotational_dynamics",
  title: "Characteristics of Circular Motion & Centripetal Acceleration",
  sequenceOrder: 1,
  learningObjectives: [
    "Differentiate between uniform and non-uniform circular motion",
    "Derive expression for centripetal force and centripetal acceleration",
    "Apply equations to vehicles on banked and unbanked roads",
  ],
  textbookPageReference: {
    startPage: 1,
    endPage: 6,
  },
  provenance: {
    source: "Maharashtra State Board Class 12 Physics Textbook (Balbharati)",
    sourceType: "textbook",
    sourceReference: "Chapter 1: Rotational Dynamics, Section 1.1–1.3, pp. 1–6",
    chapterId: "ch_01_rotational_dynamics",
    topicId: "topic_rotational_01",
    contentVersion: "v1.0.0",
    verified: true,
    verifiedBy: "Maharashtra Board Textbook Subject Committee",
    verifiedAt: "2024-06-01T00:00:00Z",
    status: "VERIFIED",
  },
  masteryCriteria: {
    minMcqAccuracyPercent: 80,
    minNumericalsCompleted: 1,
  },
  blocks: [
    {
      id: "ch01_blk_01_theory",
      type: "theory",
      order: 1,
      title: "1.1 Circular Motion & Basic Kinematics",
      content:
        "Motion of a particle along the circumference of a circle is called circular motion. It is an accelerated periodic motion because velocity vector changes direction continuously at every instant.\n\nAngular displacement (θ), angular velocity (ω = dθ/dt), and angular acceleration (α = dω/dt) describe the rotational kinematics.",
      provenance: {
        source: "Balbharati Class 12 Physics",
        sourceType: "textbook",
        sourceReference: "Section 1.1, p. 1",
        chapterId: "ch_01_rotational_dynamics",
        topicId: "topic_rotational_01",
        contentVersion: "v1.0.0",
        verified: true,
        status: "VERIFIED",
      },
    },
    {
      id: "ch01_blk_02_def",
      type: "definition",
      order: 2,
      term: "Centripetal Force",
      statement:
        "A force providing the centripetal acceleration to a particle performing circular motion, directed towards the centre along the radius.",
      symbol: "F_cp",
      unit: "N (Newton)",
      provenance: {
        source: "Balbharati Class 12 Physics",
        sourceType: "textbook",
        sourceReference: "Section 1.2.1, p. 2",
        chapterId: "ch_01_rotational_dynamics",
        topicId: "topic_rotational_01",
        contentVersion: "v1.0.0",
        verified: true,
        status: "VERIFIED",
      },
    },
    {
      id: "ch01_blk_03_eq",
      type: "equation",
      order: 3,
      title: "Centripetal Force Magnitude",
      latex: "F_{cp} = \\frac{m \\cdot v^2}{r} = m \\cdot \\omega^2 \\cdot r",
      variables: [
        { symbol: "m", name: "Mass of revolving particle", unit: "kg" },
        { symbol: "v", name: "Linear tangential speed", unit: "m/s" },
        { symbol: "r", name: "Radius of circular path", unit: "m" },
        { symbol: "ω", name: "Angular velocity", unit: "rad/s" },
      ],
      explanation: "Always directed radially inward towards the centre of rotation.",
    },
    {
      id: "ch01_blk_04_derivation",
      type: "derivation",
      order: 4,
      title: "Maximum Safe Speed on an Unbanked Curved Road",
      targetFormulaLatex: "v_{max} = \\sqrt{\\mu_s \\cdot r \\cdot g}",
      steps: [
        {
          stepNumber: 1,
          statement: "Vertical equilibrium of the vehicle: Normal reaction balances weight.",
          latex: "N = m \\cdot g",
          rationale: "No vertical acceleration occurs.",
        },
        {
          stepNumber: 2,
          statement: "Centripetal force is provided solely by static friction between tyres and road surface.",
          latex: "f_s = \\frac{m \\cdot v^2}{r}",
          rationale: "Radial inward force constraint.",
        },
        {
          stepNumber: 3,
          statement: "Limiting static friction is proportional to normal reaction: f_s \\le \\mu_s N.",
          latex: "\\frac{m \\cdot v_{max}^2}{r} = \\mu_s \\cdot m \\cdot g",
          rationale: "At maximum safe speed, friction reaches its limiting maximum value.",
        },
        {
          stepNumber: 4,
          statement: "Cancel mass m on both sides and solve for v_max.",
          latex: "v_{max} = \\sqrt{\\mu_s \\cdot r \\cdot g}",
        },
      ],
    },
    {
      id: "ch01_blk_05_formula_lab",
      type: "formula_lab",
      order: 5,
      formulaTitle: "Safe Turning Speed Simulation",
      equationLatex: "v = \\sqrt{\\mu \\cdot r \\cdot g}",
      targetVariable: "v_{max}",
      variables: [
        { id: "mu", name: "Friction Coefficient (μ)", symbol: "μ", min: 0.1, max: 1.0, step: 0.05, defaultValue: 0.4, unit: "ratio" },
        { id: "r", name: "Curve Radius", symbol: "r", min: 10, max: 200, step: 10, defaultValue: 50, unit: "m" },
        { id: "g", name: "Gravity (g)", symbol: "g", min: 9.8, max: 9.8, step: 0.1, defaultValue: 9.8, unit: "m/s²" },
      ],
      calculateFnBody: "Math.sqrt(vars.mu * vars.r * vars.g)",
    },
    {
      id: "ch01_blk_06_mcq",
      type: "mcq",
      order: 6,
      question: "The maximum safe speed of a vehicle on a horizontal unbanked curved road of radius r is independent of:",
      options: [
        "(A) Radius of the curve",
        "(B) Mass of the vehicle",
        "(C) Coefficient of friction",
        "(D) Acceleration due to gravity",
      ],
      correctOptionIndex: 1,
      hint: "Examine the formula v_max = √(μ_s * r * g). Does vehicle mass 'm' appear in it?",
      explanation: "Since v_max = √(μ_s * r * g), the maximum safe speed is independent of the mass of the vehicle. Heavy and light vehicles have the same speed limit.",
    },
    {
      id: "ch01_blk_07_pyq",
      type: "pyq",
      order: 7,
      year: 2024,
      marks: 2,
      question: "Define centripetal force and give its SI unit and dimensions.",
      modelAnswer: "Definition: The inward force along the radius required to keep a body moving in a circular path.\nSI Unit: Newton (N).\nDimensions: [L¹ M¹ T⁻²].",
      markingScheme: [
        { point: "Correct definition of centripetal force", marks: 1 },
        { point: "Correct SI unit and dimensions [L¹ M¹ T⁻²]", marks: 1 },
      ],
    },
    {
      id: "ch01_blk_08_summary",
      type: "summary",
      order: 8,
      keyTakeaways: [
        "Uniform circular motion has constant speed but continuously changing velocity.",
        "Centripetal acceleration a = v²/r = ω²r is always directed towards the centre.",
        "Maximum safe speed on unbanked curve is v_max = √(μ r g), which is mass-independent.",
      ],
      quickFormulas: [
        { name: "Centripetal Force", latex: "F = (m v^2) / r" },
        { name: "Unbanked Curve Speed", latex: "v_{max} = \\sqrt{\\mu r g}" },
      ],
    },
    {
      id: "ch01_blk_09_mastery_gate",
      type: "mastery_gate",
      order: 9,
      minMcqAccuracyPercent: 80,
      minNumericalsCompleted: 1,
    },
  ],
};

export const VERIFIED_TOPIC_PACKAGES: Record<string, TopicPackage> = {
  "topic_rotational_01": PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC,
  "topic-1": PUBLISHED_ROTATIONAL_DYNAMICS_TOPIC,
};

export interface ChapterMetadata {
  id: string;
  chapterNumber: number;
  title: string;
  weightageMarks: number;
  topicCount: number;
}

export const OFFICIAL_CHAPTERS_MANIFEST: ChapterMetadata[] = [
  { id: "ch_01_rotational_dynamics", chapterNumber: 1, title: "Rotational Dynamics", weightageMarks: 7, topicCount: 12 },
  { id: "ch_02_mechanical_properties_fluids", chapterNumber: 2, title: "Mechanical Properties of Fluids", weightageMarks: 7, topicCount: 10 },
  { id: "ch_03_kinetic_theory_gases_radiation", chapterNumber: 3, title: "Kinetic Theory of Gases and Radiation", weightageMarks: 7, topicCount: 9 },
  { id: "ch_04_thermodynamics", chapterNumber: 4, title: "Thermodynamics", weightageMarks: 7, topicCount: 8 },
  { id: "ch_05_oscillations", chapterNumber: 5, title: "Oscillations", weightageMarks: 7, topicCount: 11 },
  { id: "ch_06_superposition_waves", chapterNumber: 6, title: "Superposition of Waves", weightageMarks: 6, topicCount: 10 },
  { id: "ch_07_wave_optics", chapterNumber: 7, title: "Wave Optics", weightageMarks: 7, topicCount: 10 },
  { id: "ch_08_electrostatics", chapterNumber: 8, title: "Electrostatics", weightageMarks: 6, topicCount: 12 },
  { id: "ch_09_current_electricity", chapterNumber: 9, title: "Current Electricity", weightageMarks: 6, topicCount: 8 },
  { id: "ch_10_magnetic_fields_current", chapterNumber: 10, title: "Magnetic Fields due to Electric Current", weightageMarks: 6, topicCount: 9 },
  { id: "ch_11_magnetic_materials", chapterNumber: 11, title: "Magnetic Materials", weightageMarks: 5, topicCount: 7 },
  { id: "ch_12_electromagnetic_induction", chapterNumber: 12, title: "Electromagnetic Induction", weightageMarks: 7, topicCount: 10 },
  { id: "ch_13_ac_circuits", chapterNumber: 13, title: "AC Circuits", weightageMarks: 6, topicCount: 8 },
  { id: "ch_14_dual_nature_radiation_matter", chapterNumber: 14, title: "Dual Nature of Radiation and Matter", weightageMarks: 5, topicCount: 8 },
  { id: "ch_15_structure_atoms_nuclei", chapterNumber: 15, title: "Structure of Atoms and Nuclei", weightageMarks: 6, topicCount: 9 },
  { id: "ch_16_semiconductor_devices", chapterNumber: 16, title: "Semiconductor Devices", weightageMarks: 5, topicCount: 8 },
];

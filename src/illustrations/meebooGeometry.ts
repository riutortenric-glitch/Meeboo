export type BodyTrack = 'muscle' | 'fat';

export const bodyStageLabels: Record<BodyTrack, string[]> = {
  muscle: ['Very lean', 'Lean', 'Toned', 'Fit', 'Athletic', 'Defined', 'Strong', 'Muscular', 'Very muscular', 'Elite'],
  fat: ['Lean', 'Slim', 'Fit', 'Average', 'Soft', 'Fuller', 'Heavy', 'Very heavy', 'Plus', 'Maximum'],
};

export interface BodyMetrics {
  shoulderHalf: number;
  chestHalf: number;
  waistHalf: number;
  hipHalf: number;
  armWidth: number;
  legWidth: number;
  bicepBulge: number; // 0-1, extra width layered on the upper arm
  definitionOpacity: number; // 0-1, strength of ab/pec line overlays
}

const clampStage = (stage: number) => Math.max(0, Math.min(9, Math.round(stage)));

export function getBodyMetrics(track: BodyTrack, stageInput: number): BodyMetrics {
  const stage = clampStage(stageInput);
  const t = stage / 9; // 0..1

  if (track === 'muscle') {
    return {
      shoulderHalf: 34 + stage * 3.4,
      chestHalf: 32 + stage * 3.9,
      waistHalf: 27 - stage * 0.7,
      hipHalf: 25 + stage * 0.6,
      armWidth: 15 + stage * 2.5,
      legWidth: 21 + stage * 2.7,
      bicepBulge: t,
      definitionOpacity: Math.max(0, (stage - 3) / 6),
    };
  }

  return {
    shoulderHalf: 30 + stage * 1.7,
    chestHalf: 30 + stage * 2.5,
    waistHalf: 28 + stage * 5.7,
    hipHalf: 27 + stage * 4.8,
    armWidth: 15 + stage * 1.9,
    legWidth: 22 + stage * 2.6,
    bicepBulge: 0,
    definitionOpacity: 0,
  };
}

export function torsoPath(m: BodyMetrics, top: number, chestY: number, waistY: number, bottom: number, cx = 100) {
  const L = (half: number) => cx - half;
  const R = (half: number) => cx + half;
  const { shoulderHalf, chestHalf, waistHalf, hipHalf } = m;
  return `
    M ${L(shoulderHalf)} ${top}
    C ${L(shoulderHalf)} ${top + 18}, ${L(chestHalf)} ${chestY - 14}, ${L(chestHalf)} ${chestY}
    C ${L(chestHalf)} ${chestY + 22}, ${L(waistHalf)} ${waistY - 16}, ${L(waistHalf)} ${waistY}
    C ${L(waistHalf)} ${waistY + 16}, ${L(hipHalf)} ${bottom - 14}, ${L(hipHalf)} ${bottom}
    L ${R(hipHalf)} ${bottom}
    C ${R(hipHalf)} ${bottom - 14}, ${R(waistHalf)} ${waistY + 16}, ${R(waistHalf)} ${waistY}
    C ${R(waistHalf)} ${waistY - 16}, ${R(chestHalf)} ${chestY + 22}, ${R(chestHalf)} ${chestY}
    C ${R(chestHalf)} ${chestY - 14}, ${R(shoulderHalf)} ${top + 18}, ${R(shoulderHalf)} ${top}
    Q ${cx} ${top - 12}, ${L(shoulderHalf)} ${top}
    Z
  `;
}

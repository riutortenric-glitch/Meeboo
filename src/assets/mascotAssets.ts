export interface ImageAsset {
  source: number;
  width: number;
  height: number;
}

// Muscle scale (goal = build muscle / both): index 0 = leanest, 9 = most muscular.
export const muscleScale: ImageAsset[] = [
  { source: require('../../assets/mascot/muscle/muscle_00.png'), width: 67, height: 172 },
  { source: require('../../assets/mascot/muscle/muscle_01.png'), width: 72, height: 170 },
  { source: require('../../assets/mascot/muscle/muscle_02.png'), width: 73, height: 169 },
  { source: require('../../assets/mascot/muscle/muscle_03.png'), width: 77, height: 171 },
  { source: require('../../assets/mascot/muscle/muscle_04.png'), width: 83, height: 173 },
  { source: require('../../assets/mascot/muscle/muscle_05.png'), width: 86, height: 173 },
  { source: require('../../assets/mascot/muscle/muscle_06.png'), width: 93, height: 174 },
  { source: require('../../assets/mascot/muscle/muscle_07.png'), width: 93, height: 175 },
  { source: require('../../assets/mascot/muscle/muscle_08.png'), width: 201, height: 393 },
  { source: require('../../assets/mascot/muscle/muscle_09.png'), width: 303, height: 539 },
];

// Fat scale (goal = lose fat / just be healthier): index 0 = leanest, 9 = heaviest.
export const fatScale: ImageAsset[] = [
  { source: require('../../assets/mascot/fat/fat_00.png'), width: 127, height: 381 },
  { source: require('../../assets/mascot/fat/fat_01.png'), width: 139, height: 378 },
  { source: require('../../assets/mascot/fat/fat_02.png'), width: 142, height: 376 },
  { source: require('../../assets/mascot/fat/fat_03.png'), width: 159, height: 376 },
  { source: require('../../assets/mascot/fat/fat_04.png'), width: 172, height: 379 },
  { source: require('../../assets/mascot/fat/fat_05.png'), width: 189, height: 381 },
  { source: require('../../assets/mascot/fat/fat_06.png'), width: 193, height: 384 },
  { source: require('../../assets/mascot/fat/fat_07.png'), width: 201, height: 385 },
  { source: require('../../assets/mascot/fat/fat_08.png'), width: 209, height: 388 },
  { source: require('../../assets/mascot/fat/fat_09.png'), width: 233, height: 391 },
];

export const defaultMascotBody: ImageAsset = {
  source: require('../../assets/mascot/mascot_default.png'),
  width: 583,
  height: 629,
};

export const flameAsset: ImageAsset = {
  source: require('../../assets/mascot/flame_standalone.png'),
  width: 158,
  height: 200,
};

export const phoneMockup = require('../../assets/mascot/phone_mockup.png');

export function bodyForStage(scale: ImageAsset[], stageIndex: number): ImageAsset {
  const clamped = Math.max(0, Math.min(scale.length - 1, Math.round(stageIndex)));
  return scale[clamped];
}

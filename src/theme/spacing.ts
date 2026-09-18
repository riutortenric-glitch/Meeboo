export const spacing = { xxs: 4, xs: 6, sm: 8, md: 12, lg: 16, xl: 20, xxl: 28, xxxl: 40, huge: 56 };
export const radii = { xs: 10, sm: 14, md: 20, lg: 26, xl: 32, pill: 999 };

// Soft, diffused elevation — never a harsh drop shadow. Tuned in three steps
// so cards, floating bars and modals each read at a distinct depth.
export const shadow = {
  subtle: {
    shadowColor: '#0B1B32',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  card: {
    shadowColor: '#0B1B32',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  soft: {
    shadowColor: '#0B1B32',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 22,
    elevation: 5,
  },
  raised: {
    shadowColor: '#0B1B32',
    shadowOffset: { width: 0, height: 18 },
    shadowOpacity: 0.16,
    shadowRadius: 36,
    elevation: 10,
  },
  glow: {
    shadowColor: '#2E7CEB',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.28,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

// Shared motion feel — consistent 250-350ms ease-in-out per the spec, plus a
// bouncy spring reserved for celebratory / playful moments (flame surge,
// badge unlock, milestone).
export const motion = {
  fast: 180,
  base: 280,
  slow: 380,
  spring: { damping: 14, mass: 0.9, stiffness: 170 },
  gentleSpring: { damping: 18, mass: 1, stiffness: 120 },
};

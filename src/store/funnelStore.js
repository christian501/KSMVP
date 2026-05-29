import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useFunnelStore = create(
  persist(
    (set, get) => ({
      // Lead info
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      agencyName: '',
      state: '',
      agentType: '',
      yearsInBusiness: '',

      // Quiz
      currentQuestion: 0,
      answers: {},

      // Results
      totalScore: null,
      pillarScores: null,
      tier: null,

      // Conversion
      isRegistered: false,
      isVIP: false,

      // Actions
      setLead:       (data)   => set(data),
      setAnswer:     (q, val) => set((s) => ({ answers: { ...s.answers, [q]: val } })),
      setScore:      (score, pillarScores, tier) => set({ totalScore: score, pillarScores, tier }),
      setRegistered: ()       => set({ isRegistered: true }),
      setVIP:        ()       => set({ isVIP: true }),
      reset:         ()       => set({
        firstName: '', lastName: '', email: '', phone: '',
        agencyName: '', state: '', agentType: '', yearsInBusiness: '',
        currentQuestion: 0, answers: {}, totalScore: null,
        pillarScores: null, tier: null, isRegistered: false, isVIP: false,
      }),
    }),
    { name: 'fpas-funnel' }
  )
);

export function calculateScore(answers) {
  const vals = Object.values(answers).map(Number);
  const total = vals.reduce((s, v) => s + v, 0);

  const pillarScores = {
    ai:        ((answers[0] || 1) + (answers[1] || 1) + (answers[2] || 1)),
    va:        ((answers[3] || 1) + (answers[4] || 1)),
    tech:      ((answers[5] || 1) + (answers[6] || 1)),
    social:    ((answers[7] || 1) + (answers[8] || 1)),
    retention: ((answers[9] || 1) + (answers[10] || 1) + (answers[11] || 1)),
  };

  const tier =
    total <= 20 ? 'resistant' :
    total <= 30 ? 'aware'     :
    total <= 40 ? 'adopting'  : 'first';

  return { total, pillarScores, tier };
}

export const PILLAR_MAX = { ai: 12, va: 8, tech: 8, social: 8, retention: 12 };

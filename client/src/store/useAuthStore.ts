import { create } from 'zustand';

interface AuthState {
  alumno: { id: string; nome: string; idade: number } | null;
  sessaoId: string | null;
  login: (pin: string) => Promise<boolean>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  alumno: null,
  sessaoId: null,

  login: async (pin: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'https://vapi.v2.aulasonlinepercussao.com';
      const response = await fetch(`${API_URL}/api/auth/kid`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ codigo_vinculo: pin })
      });

      if (response.ok) {
        const data = await response.json();
        set({ alumno: data.alumno, sessaoId: data.sessaoId });
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login failed", error);
      return false;
    }
  },

  logout: () => set({ alumno: null, sessaoId: null })
}));

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
      const response = await fetch('/api/auth/kid', {
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

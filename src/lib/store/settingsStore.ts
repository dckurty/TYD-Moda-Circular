import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface TeamImages {
  heroImage: string;
  tamaraImage: string;
  dafneImage: string;
  ylaniaImage: string;
}

interface SettingsState {
  teamImages: TeamImages;
  updateTeamImage: (key: keyof TeamImages, base64Url: string) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      teamImages: {
        heroImage: "",
        tamaraImage: "",
        dafneImage: "",
        ylaniaImage: "",
      },
      updateTeamImage: (key, base64Url) =>
        set((state) => ({
          teamImages: {
            ...state.teamImages,
            [key]: base64Url,
          },
        })),
    }),
    {
      name: 'tyd-admin-settings',
    }
  )
);

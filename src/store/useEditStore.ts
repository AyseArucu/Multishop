import { create } from 'zustand';

interface EditState {
  isEditMode: boolean;
  draftSettings: Record<string, string>;
  toggleEditMode: () => void;
  setDraftSettings: (settings: Record<string, string>) => void;
  updateDraftSetting: (key: string, value: string) => void;
  moveSectionUp: (index: number) => void;
  moveSectionDown: (index: number) => void;
}

export const useEditStore = create<EditState>((set) => ({
  isEditMode: false,
  draftSettings: {},
  toggleEditMode: () => set((state) => ({ isEditMode: !state.isEditMode })),
  setDraftSettings: (settings) => set({ draftSettings: settings }),
  updateDraftSetting: (key, value) => set((state) => ({
    draftSettings: { ...state.draftSettings, [key]: value }
  })),
  moveSectionUp: (index) => set((state) => {
    if (index === 0) return state; // Already at top
    const currentLayout = state.draftSettings.homepageLayout?.split(',') || [];
    const newLayout = [...currentLayout];
    const temp = newLayout[index - 1];
    newLayout[index - 1] = newLayout[index];
    newLayout[index] = temp;
    return {
      draftSettings: { ...state.draftSettings, homepageLayout: newLayout.join(',') }
    };
  }),
  moveSectionDown: (index) => set((state) => {
    const currentLayout = state.draftSettings.homepageLayout?.split(',') || [];
    if (index === currentLayout.length - 1) return state; // Already at bottom
    const newLayout = [...currentLayout];
    const temp = newLayout[index + 1];
    newLayout[index + 1] = newLayout[index];
    newLayout[index] = temp;
    return {
      draftSettings: { ...state.draftSettings, homepageLayout: newLayout.join(',') }
    };
  })
}));

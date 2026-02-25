import { create } from 'zustand';
const initialState = {
    roomType: '',
    roomLength: '',
    roomWidth: '',
    roomHeight: '',
    photos: [],
    floorPlan: null,
    selectedStyles: [],
    colorPreferences: [],
    mustHaves: [],
    avoid: [],
    existingFurniture: '',
    budgetMin: 50000,
    budgetMax: 150000,
    whatYouLove: '',
    whatFrustrates: '',
    designerPersona: '',
    currentStep: 1,
};
export const useIntakeStore = create((set) => ({
    ...initialState,
    setRoomBasics: (data) => set((state) => ({ ...state, ...data })),
    setStylePreferences: (data) => set((state) => ({ ...state, ...data })),
    setRequirements: (data) => set((state) => ({ ...state, ...data })),
    setDesigner: (persona) => set({ designerPersona: persona }),
    setCurrentStep: (step) => set({ currentStep: step }),
    reset: () => set(initialState),
}));

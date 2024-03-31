import { create } from 'zustand'

export const useStore = create((set) => ({
  currentStudents: [],
  oldStudents: [],
  auth: false,
  setCurrentStudents: (payload) => (state) => set({ currentStudents: payload}) ,
  setOldStudents: (payload) => (state) => set({ oldStudents: payload}),
  authenticate: () => set({auth: true}),
  unauthenticate: () => set({auth: false})
}))

export const useManageCoursesStore = create(set => ({
  modalIsActive: false,
  selectedId: null,
  modalDefinition: "",
  selectedCourse: null,
  modalToggle: () => set((state) => ({ modalIsActive: !state.modalIsActive })),
  setSelectedId: (payload) => set(() => ({ selectedId: payload})),
  setModalDefinition: (payload) => set(() => ({ modalDefinition: payload})),
  setSelectedCourse: (payload) => set(() => ({ selectedCourse: payload}))
}))
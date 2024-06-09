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
  courses: [],
  requirements: [],

  modalToggle: () => set((state) => ({ modalIsActive: !state.modalIsActive })),
  setSelectedId: (payload) => set(() => ({ selectedId: payload})),
  setModalDefinition: (payload) => set(() => ({ modalDefinition: payload})),
  setSelectedCourse: (payload) => set(() => ({ selectedCourse: payload})),
  setCourses: (payload) => set(() => ({ courses: payload})),
  setRequirements: (payload) => set(() => ({ requirements: payload}))
}))

export const userStore = create(set => ({
  email: null,
  user: null,
  admin: null,
  setEmail: (payload) => set(() => ({ email: payload })),
  setUser: (payload) => set(() => ({ user: payload })),
  setAdmin: (payload) => set(() => ({ admin: payload }))
}))

export const loadingStore = create(set => ({
  loading: true,
  setLoading: (payload) => set(() => ({ loading: payload }))
}))
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
import { create } from 'zustand'

export const useStore = create((set) => ({
  currentStudents: [],
  oldStudents: [],
  setCurrentStudents: (payload) => (state) => set({ currentStudents: payload}) ,
  setOldStudents: (payload) => (state) => set({ oldStudents: payload}),
}))
'use client'

import { validateCredentials } from "./dbActions"

export const useAuth = async (user: string, pass: string) => {

  return await validateCredentials(user, pass)
  
}
'use client'

import { validateCredentials } from "./dbActions"

export const useAuth = async (user: string, pass: string) => {

  const authenticate = await validateCredentials(user, pass)
  
  if (authenticate?.status === 200) {
    return true
  }

  return false
  
}
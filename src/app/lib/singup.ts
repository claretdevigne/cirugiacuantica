'use server'
import { randomUUID } from "crypto"
import { createNewUser } from "./dbActions"
const bcrypt = require("bcrypt")

const hashPassword = async (password: string) => {
  const saltRounds = 12
  const hashedPassword = await bcrypt.hash(password, saltRounds)
  return hashedPassword
  
}

export const useSignup = async (name: string, email: string, password: string, repassword: string) => {

  const cleanName = name.split(" ")
    .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim()

  const cleanEmail = email.toLowerCase().trim()

  const newUser = {
    "_id": randomUUID(),
    "name": cleanName,
    "email": cleanEmail,
    "password": await hashPassword(password),
    "admin": false,
    "current_courses": [],
    "courses_completed": []
  }

  return await createNewUser(newUser)
    .then(res => res?.status)

}
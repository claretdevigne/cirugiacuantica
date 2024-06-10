'use server'
import { createNewUser } from "./dbActions"
const bcrypt = require("bcrypt")

const hashPassword = async (password: string) => {
  const saltRounds = bcrypt.genSaltSync(12)
  const hashedPassword = bcrypt.hash(password, saltRounds)
  return hashedPassword
}

export const signup = async (name: string, email: string, phone: string, country: string, password: string, repassword: string) => {

  const cleanName = name.split(" ")
    .map(word => word.charAt(0).toLocaleUpperCase() + word.slice(1).toLowerCase())
    .join(" ")
    .trim()

  const cleanEmail = email.toLowerCase().trim()

  const cursos = {
    "cirugias_cuanticas_nivel_1": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_avanzadas": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_adn": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_cerebro_ojos_corazon": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_limpieza_multidimensional": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_rejuvenecimiento": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_animales": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_dinero": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_superpoderes_cuanticos": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_mutantes_reloaded": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_habilidades_psiquicas": {
      modalidad: "",
      estatus: "inactivo"
    },
    "cirugias_cuanticas_entrenamiento_facilitadores": {
      modalidad: "",
      estatus: "inactivo"
    }
  };
  

  const newUser = {
    "_id": cleanEmail,
    "nombre": cleanName,
    "email": cleanEmail,
    "telefono": phone,
    "password": await hashPassword(password),
    "admin": false,
    "pais": country,
    cursos: cursos,
  }

  return await createNewUser(newUser)
    .then(res => res?.status)

}
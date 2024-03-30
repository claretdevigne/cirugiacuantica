'use server'

const bcrypt = require("bcrypt")
import { USER } from "@/types/user"
import { randomUUID } from "crypto"

const { MongoClient } = require("mongodb")
const MD_URI = "mongodb+srv://claretdevigne:c14r37dv@cluster0.gcoddci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "cirugiascuanticas" 
const usersCollectionName = "users"
const sessionsCollectionName = "sessions"
const coursesCollectionName = "courses"
const client = new MongoClient(MD_URI)

/**
 * 
 * SESSIONS ----------------
 */

const connectDB = async (dbName: string, colName: string) => {
    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(colName)
        return col
    } catch (err) {
        return err
    }
}

const closeConnection = async () => {
    client.close()
}


// CREA UN TOKEN UUID
const createToken = async () => {
    return await randomUUID()
}

// CREA UNA SESIÓN EN LA BASE DE DATOS
const createSession = async (email: string) => {

    try {
        const connection = await connectDB(dbName, sessionsCollectionName)
        const date = new Date()
        const currentDate = date.toString()
        const expirationDate = new Date(date.getTime() + 3600000).toString()
        const token = await createToken()

        const newSession = {
            token: token,
            email: email,
            creation_date: currentDate,
            expiration_date: expirationDate
        }

        const sessionSaved = await connection.insertOne(newSession)
        
        if (sessionSaved) {
            return {
                status: 200,
                token: token
            }
        }

        return {
            status: 401
        }
        
    } catch (err) {
        console.log("Fallo al conectar");    
    } finally {

        closeConnection()

    }

}

// ELIMINA UNA SESION
export const removeSession = async (token: string) => {

    try {
        const connection = await connectDB(dbName, sessionsCollectionName)
        
        const sessionRemoved = await connection.deleteOne({ token: token })

        console.log(sessionRemoved)
        
    } catch (err) {
        console.log("Fallo al conectar");    
    } finally {
        closeConnection()
    }

}

/**
 * 
 * USERS ------------------------------------------------
 */

// GET ALL USERS
export const getAllUsers = async () => {

    try {
        const connection = await connectDB(dbName, usersCollectionName)
        const results = await connection.find({}).toArray()
        client.close()
        return await results
        
    } catch (err) {
        console.log("Fallo al conectar");    
    } finally {
        closeConnection()
    }
}


// CREATE USER
export const createNewUser = async (newUser: USER) => {

    try {
        const connection = await connectDB(dbName, usersCollectionName)

        const user = await connection.find({ email: newUser.email }).toArray()

        if (user.length) {
            client.close()
            return {
                status: 409
            }
        }

        await connection.insertMany([newUser])
        client.close()
        return { status: 201 }
        
    } catch (err) {
        console.log("Fallo al conectar");    
    } finally {
        closeConnection()
    }
}

/**
 * 
 * COURSES -------------------------------------------------------
 * 
 */

export const getAllCourses = async (token: string) => {
    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const connection = await connectDB(dbName, coursesCollectionName)

        const courses = connection.find({}).toString()

        if (courses.length) {
            return {
                status: 200,
                courses: courses
            }
        }

        return {
            status: 204
        }
    }

    return { status: 401 }


}


/**
 * VALIDATIONS ------------------------------------
 */


// VALIDATE CREDENCIALS
export const validateCredentials = async (email: string, password: string) => {

    try {
        const connection = await connectDB(dbName, usersCollectionName)

        const user = await connection.find({ email: email }).toArray()

        if (!user.length) {
            
            return {
                status: 404
            }
        }
        
        // VERIFICA SI LA CONTRASEÑA ES CORRECTA. DEVUELVE UN BOOLEANO.
        const result = await bcrypt.compare(password, user[0].password)        
        
        if (result) {
            
            // CREA LA SESIÓN EN LA BASE DE DATOS.
            const session = createSession(email)
            return session.then(res => {
                if (res?.status === 200) {
                    return {
                        status: res.status,
                        token: res.token
                    }
                }
            })
        } 
        
        return { status: 401 }
        
    } catch (err) {
        console.log("Fallo al conectar");    
    } finally {
        closeConnection()
    }
}

export const validateToken = async (token: string) => {

    try {

        const connection = await connectDB(dbName, sessionsCollectionName)

        const session = await connection.find({ token: token }).toArray()

        if (session.length) {

            const currentDate = new Date().toString()
            
            if (session[0].expiration_date > currentDate) {
                return {
                    status: 200,
                    email: session[0].email
                }
            } else {
                removeSession(token)
                return {
                    status: 401
                }
            }
        }
        
        
        return { status: 401 }
        
    } catch (err) {
        console.log("Fallo al conectar");    
    } finally {
        closeConnection()
    }
}

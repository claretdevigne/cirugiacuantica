'use server'

const bcrypt = require("bcrypt")
import { USER } from "@/types/user"
import { log } from "console"
import { randomUUID } from "crypto"

const { MongoClient } = require("mongodb")
const MD_URI = "mongodb+srv://claretdevigne:c14r37dv@cluster0.gcoddci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "cirugiascuanticas" 
const usersCollectionName = "users"
const sessionsCollectionName = "sessions"
const client = new MongoClient(MD_URI)

// CREA UN TOKEN UUID
const createToken = async () => {
    return await randomUUID()
}

// CREA UNA SESIÓN EN LA BASE DE DATOS
const createSession = async (email: string) => {

    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(sessionsCollectionName)
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

        const sessionSaved = await col.insertOne(newSession)

        if (sessionSaved.acknowledged) {
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
    }

}

export const removeSession = async (token: string) => {

    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(sessionsCollectionName)
        
        const sessionRemoved = await col.deleteOne({ token: token })

        console.log(sessionRemoved)
        
    } catch (err) {
        console.log("Fallo al conectar");    
    }

}

export const removeTokenSession = async (token: string) => {

    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(sessionsCollectionName)
        const user = await col.deleteMany({ token: token })
        
    } catch (err) {
        console.log("Fallo al conectar");    
    }

}

// GET ALL USERS
export const getAllUsers = async () => {

    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(usersCollectionName)
        const results = await col.find({}).toArray()
        client.close()
        return await results
        
    } catch (err) {
        console.log("Fallo al conectar");    
    }
}


// CREATE USER
export const createNewUser = async (newUser: USER) => {

    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(usersCollectionName)

        const user = await col.find({ email: newUser.email }).toArray()

        if (user.length) {
            client.close()
            return {
                status: 409
            }
        }

        await col.insertMany([newUser])
        client.close()
        return { status: 201 }
        
    } catch (err) {
        console.log("Fallo al conectar");    
    }
}

// VALIDATE CREDENCIALS
export const validateCredentials = async (email: string, password: string) => {

    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(usersCollectionName)

        const user = await col.find({ email: email }).toArray()
        client.close()

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
    }
}

export const validateToken = async (token: string) => {

    try {
        await client.connect()
        const db = client.db(dbName)
        const col = db.collection(sessionsCollectionName)

        const session = await col.find({ token: token }).toArray()
        client.close()

        if (session.length) {

            const currentDate = new Date().toString()
            
            if (session[0].expiration_date > currentDate) {
                return {
                    status: 200
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
    }
}

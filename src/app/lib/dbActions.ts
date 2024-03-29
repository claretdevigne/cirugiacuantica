'use server'

import { USER } from "@/types/user"

const { MongoClient } = require("mongodb")
const MD_URI = "mongodb+srv://claretdevigne:c14r37dv@cluster0.gcoddci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "cirugiascuanticas" 
const usersCollectionName = "users"
const client = new MongoClient(MD_URI)

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
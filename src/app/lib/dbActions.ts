'use server'

const bcrypt = require("bcrypt")
import { COURSE } from "@/types/courses"
import { USER } from "@/types/user"
import { randomUUID } from "crypto"
import { ObjectId } from "mongodb"

const { MongoClient } = require("mongodb")
const MD_URI = "mongodb+srv://claretdevigne:c14r37dv@cluster0.gcoddci.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "cirugiascuanticas" 
const usersCollectionName = "users"
const sessionsCollectionName = "sessions"
const coursesCollectionName = "courses"
const client = new MongoClient(MD_URI)

const connectDB = async (dbName: string, colName: string) => {
    try {
        await client.connect()
        const db = client.db(dbName)
        const col = await db.collection(colName)
        return col
    } catch (err) {
        return err
    }
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
            const session = createSession(email, user[0].admin)

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
    }
}



/**
 * 
 * SESSIONS ----------------
 */


// CREA UN TOKEN UUID
const createToken = async () => {
    return await randomUUID()
}

// CREA UNA SESIÓN EN LA BASE DE DATOS
const createSession = async (email: string, admin: boolean) => {

    try {
        const connection = await connectDB(dbName, sessionsCollectionName)
        const date = new Date()
        const currentDate = date.toString()
        const expirationDate = new Date(date.getTime() + 3600000).toString()
        const token = await createToken()

        const newSession = {
            token: token,
            email: email,
            admin: admin,
            creation_date: currentDate,
            expiration_date: expirationDate
        }        

        const sessionSaved = await connection.insertMany([newSession])
        
        if (sessionSaved) {
            return {
                status: 200,
                token: token,
            }
        }

        return {
            status: 401
        }
        
    } catch (err) {
        console.log("Fallo al conectar");    
    }

}

// ELIMINA UNA SESION
export const removeSession = async (token: string) => {

    try {
        const connection = await connectDB(dbName, sessionsCollectionName)
        
        const sessionRemoved = await connection.deleteOne({ token: token })
        
    } catch (err) {
        console.log("Fallo al conectar");    
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
    }
}

export const getUsersByCourseId = async (token: string, id: string) => {
    
    const validation = await validateToken(token)

    if (validation?.status === 200) {
        
        const connection = await connectDB(dbName, usersCollectionName)
        const current_students = await connection.find({ current_courses: { $in: [id] } }).toArray()
        const old_students = await connection.find({ courses_completed: { $in: [id] } }).toArray()        
        
        if (current_students.length || old_students.length) {

            const current_students_data: Array<any> = []
            const old_students_data: Array<any> = []

            current_students.map((res: any) => {
                const student = {
                    name: res.name,
                    email: res.email,
                    current_courses: res.current_courses,
                    courses_completed: res.courses_completed
                }

                current_students_data.push(student)
            })

            old_students.map((res: any) => {
                const student = {
                    name: res.name,
                    email: res.email,
                    current_courses: res.current_courses,
                    courses_completed: res.courses_completed
                }

                old_students_data.push(student)
            })

            return {
                status: 200,
                students: {
                    current_students: current_students_data,
                    old_students: old_students_data
                }
            }
        }

        return {
            status: 204
        }
    }

    return { status: 401 }


}


// GET USER DATA
export const getUserData = async (token: string, email: string) => {

    try {

        const validation = await validateToken(token)

        if (validation?.status === 200) {

            const connection = await connectDB(dbName, usersCollectionName)
            const user = await connection.find({ email: email }).toArray()
            
            const userData = {
                    name: user[0].name,
                    email: user[0].email,
                    admin: user[0].admin,
                    current_courses: user[0].current_courses,
                    courses_completed: user[0].courses_completed,
                }

            return {
                status: 200,
                userData: userData
            }

        } 
        
    } catch (err) {
        console.log("Fallo al conectar");    
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
        const courses = await connection.find({}).toArray()

        if (courses.length) {
            return {
                status: 200,
                courses: JSON.stringify(courses)
            }
        }

        return {
            status: 204
        }
    }

    return { status: 401 }


}

export const getCoursesById = async (token: string, id: string) => {
    
    const validation = await validateToken(token)
        
    if (validation?.status === 200) {
        
        const connection = await connectDB(dbName, coursesCollectionName)
        const objectID = new ObjectId(id)
        const course = await connection.find({ _id: objectID}).toArray()

        if (course.length) {
            return {
                status: 200,
                course: JSON.stringify(course)
            }
        }

        return {
            status: 204
        }
    }

    return { status: 401 }


}

export const createCourse = async (token: string, course: any) => {
    
    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const connection = await connectDB(dbName, coursesCollectionName)
        const added = await connection.insertMany([course])

        if (added) {
            return {
                status: 201
            }
        }

    return {
        status: 401
    }
}}

export const updateCourse = async (token: string, course: COURSE) => {

    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const connection = await connectDB(dbName, coursesCollectionName)
        
        const id = new ObjectId(String(course._id))

        const newCourse = {
            name: course.name,
            url: course.url,
            status: course.status,
            requirements: course.requirements
        }

        const added = await connection.updateOne({ _id: id }, { $set: newCourse })        

        if (added) {
            return {
                status: 201
            }
        }

    return {
        status: 401
    }
}}

export const deleteCourse = async (token: string, id: string) => {

    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const connection = await connectDB(dbName, coursesCollectionName)
        
        const objectId = new ObjectId(String(id))

        const deleted = await connection.deleteOne({ _id: objectId })
        
        if (deleted) {
            return {
                status: 404
            }
        }

    return {
        status: 401
    }
}}
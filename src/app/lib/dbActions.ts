'use server'

const bcrypt = require("bcrypt")
import { COURSE } from "@/types/courses"
import { USER } from "@/types/user"
import { randomUUID } from "crypto"
import { ObjectId } from "mongodb"

const { MongoClient } = require("mongodb")
const MD_URI = "mongodb+srv://cirugiascuanticasapp:cirugiascuanticasapp@cluster0.hxp0sie.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"
const dbName = "cirugiascuanticas" 
const usersCollectionName = "users"
const sessionsCollectionName = "sessions"
const requestsCollectionName = "requests"
const coursesCollectionName = "courses"
const adminsCollectionName = "admins"
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
        const usersConnection = await connectDB(dbName, usersCollectionName)
        const adminsConnection = await connectDB(dbName, adminsCollectionName)

        const userData = await usersConnection.find({ email: email }).toArray()
        const adminData = await adminsConnection.find({ email: email }).toArray()
        let user = null

        if (!userData.length && !adminData.length) {
            
            return {
                status: 404
            }
        }

        if (userData.length) {
            user = userData
        } else if (adminData.length) {
            user = adminData
        }
        
        // VERIFICA SI LA CONTRASEÑA ES CORRECTA. DEVUELVE UN BOOLEANO.
        
        const result = await bcrypt.compare(password, user[0].password) || user[0].password === password

        if (result) {
            
            // CREA LA SESIÓN EN LA BASE DE DATOS.
            const session = createSession(email, user[0].admin)

            return session.then(res => {
                
                if (res?.status === 200) {
                    
                    return {
                        status: res.status,
                        token: res.token,
                        admin: adminData.length
                    }
                }
            })
        } 
        
        return { status: 401 }
        
    } catch (err) {
        console.log("Fallo al conectar: VALIDATE CREDENTIALS");    
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
                    email: session[0].email,
                    admin: session[0].admin
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
        console.log("Fallo al conectar: VALIDATE TOKEN");    
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

    console.log("CREANDO SESSION");
    
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
        console.log("Fallo al conectar: CREATE SESSION");    
    }

}

// ELIMINA UNA SESION
export const removeSession = async (token: string) => {

    try {
        const connection = await connectDB(dbName, sessionsCollectionName)
        
        const sessionRemoved = await connection.deleteOne({ token: token })
        
    } catch (err) {
        console.log("Fallo al conectar: REMOVE SESSION");    
    }

}

/**
 * 
 * USERS ------------------------------------------------
 */

// GET ALL USERS
export const getAllUsers = async (token: string) => {

    try {
        const connection = await connectDB(dbName, usersCollectionName)
        const results = await connection.find({}).toArray()
        const data = JSON.stringify(results)
        return await data
        
    } catch (err) {
        console.log("Fallo al conectar: GETTING ALL USERS");    
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
export const getUserData = async (token: string, email: string, admin: boolean) => {
    
    try {

        const validation = await validateToken(token)
        
        

        if (validation?.status === 200) {

            let connection = null

            if (admin) {
                connection = await connectDB(dbName, adminsCollectionName)
            } else {
                connection = await connectDB(dbName, usersCollectionName)
            }

            const user = await connection.find({ email: email }).toArray()

            let userData = null
            
            if (admin) {
                userData = {
                    name: user[0].nombre,
                    email: user[0].email,
                    phone: user[0].telefono,
                    country: user[0].pais,
                    courses: user[0].cursos,
                    admin: admin,
                }
            } else {
                userData = {
                    facilitator: user[0].facilitador,
                    name: user[0].nombre,
                    email: user[0].email,
                    phone: user[0].telefono,
                    country: user[0].pais,
                    courses: user[0].cursos,
                    admin: admin,
                }
            }

            return {
                status: 200,
                userData: JSON.stringify(userData)
            }

        } 
        
    } catch (err) {
        console.log("Fallo al conectar: GETTING USER DATA");    
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
        console.log("Fallo al conectar: CREATE NEW USER");    
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
            estatus: course.estatus,
            estudiantes: course.estudiantes,
            facilitadores: course.facilitadores
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

// ------------ REQUESTSSSS

export const createRequest = async (token: string, courseId: string, userEmail: string) => {

    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const requestConnection = await connectDB(dbName, requestsCollectionName)
        const userConnection = await connectDB(dbName, usersCollectionName)
        const courseConnection = await connectDB(dbName, coursesCollectionName)
        
        const objectId = new ObjectId(String(courseId))

        const courseObject = await courseConnection.findOne({ _id: objectId })
        const courseName = await courseObject.name

        const userObject = await userConnection.findOne({ email: userEmail })
        const userName = await userObject.name
        
        const request = {
            userName: userName,
            courseName: courseName,
            status: false
        }
        
        const requestRespose = await requestConnection.insertMany([request])
        
        if (requestRespose) {
            return {
                status: 200
            }
        }

    return {
        status: 401
    }
}}

export const getRequests = async (token: string) => {

    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const connection = await connectDB(dbName, requestsCollectionName)
    
        const requests = await connection.find({}).toArray()
        const data = JSON.stringify(requests)
        
        if (requests) {
            return {
                status: 200,
                data: data
            }
        }

    return {
        status: 401
    }
}}

export const updateRequests = async (token: string, request: any) => {

    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const connection = await connectDB(dbName, requestsCollectionName)
        const usersConnection = await connectDB(dbName, usersCollectionName)
        const courseConnection = await connectDB(dbName, coursesCollectionName)

        const objectID = new ObjectId(String(request._id))
    
        const requests = await connection.deleteOne({ _id: objectID })
        
        //TODO: Agregar el email. Peligro de repetir nombres
        const user = await usersConnection.findOne({ name: request.userName })

        const course = await courseConnection.findOne({ name: request.courseName })

        const current_courses = [
            ...user.current_courses,
            course._id
        ]

        const userUpdated = await usersConnection.updateOne({ name: request.userName }, {
            $set: {
                current_courses: current_courses
            }
        } )
        
        if (requests) {
            return {
                status: 200
            }
        }

    return {
        status: 401
    }
}}

export const updateUser = async (token: string, user: any) => {

    const validation = await validateToken(token)

    if (validation?.status === 200) {

        const connection = await connectDB(dbName, usersCollectionName)
        
        const id = new ObjectId(String(user._id))

        const added = await connection.updateOne({ _id: id }, { $set: {
            courses_completed: [
                ...user.courses_completed,
                ...user.current_courses
            ],
            current_courses: []
        } })        

        if (added) {
            return {
                status: 201
            }
        }

    return {
        status: 401
    }
}}

// OBTENER CURSOS PARA BASE DE DATOSs

export const getCourses = async () => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    const courses = await connection.find({}).toArray();
    const data = JSON.stringify(courses)
    return data
    

}

export const addCourse = async (name: string, active: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    let course = {
        _id: name.split(" ").join("_").toLowerCase(),
        name: name,
        estatus: active,
        estudiantes: [],
        facilitadores: []
    }

    const courseAdded = await connection.insertMany([course])
    

}

export const deleteCourses = async (id: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    
    const deleted = await connection.deleteOne({ _id: id });
    

}

export const editCourses = async (id: string, name: string, estatus: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")

    const updated = await connection.updateOne({ _id: id }, {  $set: { name: name, estatus: estatus } })
}


// OBTENER ESTUDIANTES PARA BASE DE DATOS

export const getStudents = async () => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, usersCollectionName)
    const courses = await connection.find({}).toArray();
    const data = JSON.stringify(courses)
    return data
    

}

export const addStudent = async (name: string, active: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    let course = {
        _id: name.split(" ").join("_").toLowerCase(),
        name: name,
        estatus: active,
        estudiantes: [],
        facilitadores: []
    }

    const courseAdded = await connection.insertMany([course])
    

}

export const deleteStudent = async (id: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    
    const deleted = await connection.deleteOne({ _id: id });
    

}

export const updateStudent = async (user: any) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "users")

    const updated = await connection.updateOne({ _id: user._id }, 
        {  
            $set: 
                { 
                    facilitador: user.facilitador,
                    nombre: user.nombre,
                    email: user.email,
                    telefono: user.telefono,
                    pais: user.pais,
                    cursos: user.cursos, 
                } })
}

// OBTENER MIS CURSOS PARA BASE DE DATOS

export const getMisCursos = async (name: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    const courses = await connection.find({ facilitadores: {$in: [name]}}).toArray();
    const data = JSON.stringify(courses)
    return data
    

}

export const addMisCursos = async (name: string, active: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    let course = {
        _id: name.split(" ").join("_").toLowerCase(),
        name: name,
        estatus: active,
        estudiantes: [],
        facilitadores: []
    }

    const courseAdded = await connection.insertMany([course])
    

}

export const deleteMisCursos = async (id: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    
    const deleted = await connection.deleteOne({ _id: id });
    

}

export const editMisCursos = async (id: string, name: string, estatus: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")

    const updated = await connection.updateOne({ _id: id }, {  $set: { name: name, estatus: estatus } })
}

// OBTENER MIS ESTUDIANTES PARA BASE DE DATOS

export const getMyStudents = async (name: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, usersCollectionName)
    const words = name.split(' ').map(word => `\\b${word}\\b`).join('|');
    const regex = new RegExp(words, 'i'); // 'i' para hacer la búsqueda sin distinguir entre mayúsculas y minúsculas
    const courses = await connection.find({ facilitador: regex }).toArray();
    const data = JSON.stringify(courses)
    return data
    

}

export const addMyStudents = async (name: string, active: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    let course = {
        _id: name.split(" ").join("_").toLowerCase(),
        name: name,
        estatus: active,
        estudiantes: [],
        facilitadores: []
    }

    const courseAdded = await connection.insertMany([course])
    

}

export const deleteMyStudents = async (id: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "courses")
    
    const deleted = await connection.deleteOne({ _id: id });
    

}

export const updateMyStudents = async (user: any) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, "users")

    const updated = await connection.updateOne({ _id: user._id }, 
        {  
            $set: 
                { 
                    facilitador: user.facilitador,
                    nombre: user.nombre,
                    email: user.email,
                    telefono: user.telefono,
                    pais: user.pais,
                    cursos: user.cursos, 
                } })
}

// OBTENER FACILITADORES PARA BASE DE DATOS

export const getFacilitadores = async () => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, adminsCollectionName)
    const courses = await connection.find({}).toArray();
    const data = JSON.stringify(courses)
    return data
    

}

export const addFacilitadores = async (name: string, active: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, adminsCollectionName)
    let course = {
        _id: name.split(" ").join("_").toLowerCase(),
        name: name,
        estatus: active,
        estudiantes: [],
        facilitadores: []
    }

    const courseAdded = await connection.insertMany([course])
    

}

export const deleteFacilitadores = async (id: string) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, adminsCollectionName)
    
    const deleted = await connection.deleteOne({ _id: id });
    

}

export const updateFacilitadores = async (id: string, name: string, email: string, country: string, telefono: any, courses: any) => {

    const uri = MD_URI;
    const connection = await connectDB(dbName, adminsCollectionName)

    const updated = await connection.updateOne({ _id: id }, 
        {  
            $set: 
                { 
                    nombre: name,
                    email: email,
                    pais: country,
                    telefono: telefono,
                    cursos: courses, 
                } })
}
import { createRequest, getAllCourses, getUserData } from "@/app/lib/dbActions";
import { COURSE } from "@/types/courses";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import CoursesLoader from "../common/CoursesLoader";
import { userStore } from "@/reducers/store";
import { useEffect, useState } from "react";

type Course = {
  "modalidad": string,
  "estatus": string,
}

const fetchCourses = async () => {
  const token = localStorage.getItem("authToken")
    if (token) {
      return await getAllCourses(token)
      .then(res => {
        if (typeof res.courses === "string") {
          return JSON.parse(res.courses)
        }
    }).catch(err => {
      console.log("Error fetching courses. CoursesTable.tsx")
      console.log(err);
    })
}}

const refetchData = (refetch: Function, email: string, setUser: Function, admin: boolean) => {
  refetch()

  const token = localStorage.getItem("authToken")

  if (token) {
    getUserData(token, email, admin)
      .then(res => {
        if (res?.status === 200) {
          setUser(JSON.parse(res.userData))
        }
      })
  }
  
}


const CoursesTable = () => {

  const { isLoading, isError, data: courses = [], refetch } = useQuery({queryKey: ["courses"], queryFn: fetchCourses})
  const { user, setUser, admin } = userStore()

  useEffect(() => {
    const token = localStorage.getItem("authToken")

    if (token) {
      getUserData(token, user.email, admin)
        .then((res: any) => {
          if (res?.status === 200) {
            localStorage.setItem("userData", res.userData)
          }
        })
    }
    
    
  }, [])

  const handleMakeRequest = (courseId: string, userEmail: string) => {
    const token = localStorage.getItem("authToken")

    if (token) {
      return createRequest(token, courseId, userEmail)
    }
  }

  const getUrl = (id: string) => {
    const url = courses.filter((course: any) => course._id === id)[0].url
    if (url) { return url }
  }
  

  const handleInsciption = (id: string) => {
    const url = getUrl(id)
    handleMakeRequest(id, user.email)
    ?.then(res => {
      if (res?.status === 200) {
        window.location.href=url 
      }
    }) 
  }

  const EnabledButton = ( props: any ) => {

    return (
        <button onClick={() => handleInsciption(props.id)}
        className="text-white bg-yellow-500 py-4 px-6 rounded-md sm:block">
          INSCRIBIRSE
        </button>
    )
  }

  const DisabledButton = () => {
    
    return (
        <button disabled className="text-white bg-zinc-500 py-4 px-6 rounded-md sm:block">
          NO DISPONIBLE
        </button>
    )
  }

  const SuccessButton = () => {
    
    return (
        <button disabled className="text-white bg-green-500 py-4 px-6 rounded-md sm:block">
          INSCRITO
        </button>
    )
  }

  const DoneButton = () => {
    
    return (
        <button disabled className="text-white bg-green-500 py-4 px-6 rounded-md sm:block">
          CERTIFICADO
        </button>
    )
  }

  const getImage = (curso_id: string) => {

    const url = courses.filter((curso: any) => curso._id === curso_id)[0].img

    if (url) { return url } else { return "" }
  }

  const buttonRender = (estatus: string, curso_id: string, studentCourses: any, listaCursos: any) => {

    // Obtener requisitos del curso
  const req_id = listaCursos.filter((curso: any) => curso._id === curso_id)[0]?.requisitos;

  // Verificar si el usuario tiene cursos
  if (!studentCourses || Object.keys(studentCourses).length === 0) {
    return <DisabledButton />;
  }

  // Verificar el estado del curso
  if (estatus === 'activo') {
    return <SuccessButton />;
  } else if (estatus === 'certificado') {
    return <DoneButton />;
  }

  // Verificar si se cumplen los requisitos necesarios
  if (req_id && req_id.length > 0) {
    const requisitoCumplido = studentCourses[req_id[0]] && studentCourses[req_id[0]].estatus === 'certificado';
    if (requisitoCumplido) {
      return <EnabledButton id={curso_id} />;
    } else {
      return <DisabledButton />;
    }
  }

  // Si no hay requisitos o el curso no tiene requisitos
  return <EnabledButton id={curso_id} />;

    // const req_id = courses.filter((course: any) => course._id === curso_id)[0].requisitos
    // let enable = null

    // if (studentCourses[req_id]) {
    //   enable = studentCourses[req_id[0]].estatus === "certificado"
    // } else {
    //   enable = false
    // }

    // // TODO: REQUERIMIENTOS
    // if (!user.courses) {
    //   return <DisabledButton />
    // } else if (estatus === 'activo') {
    //   return <SuccessButton />
    // } else if (estatus === "certificado") {
    //   return <DoneButton />
    // } else if (enable) {
    //   return <EnabledButton id={curso_id} />
    // } else if (req_id && req_id.length === 0) {
    //   return <EnabledButton id={curso_id} />
    // } else {
    //   return <DisabledButton />
    // }
  }


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <table className="flex flex-col">
        <thead>
          <tr className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
          <th className="col-span-1 p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Imagen
            </h5>
          </th>
          <th className="col-span-3 p-2.5 xl:p-5">
            <h5 className="text-sm text-start font-medium uppercase xsm:text-base">
              Curso
            </h5>
          </th>
          <th className="flex items-center justify-center">
            <button onClick={() => refetchData(refetch, user.email, setUser, admin)} className="bg-zinc-400 text-md rounded-full px-4 text-white">Recargar</button>
          </th>
          </tr>
        </thead>
        
        {

          (isLoading)

          ?

          <CoursesLoader />

          :
          
          <tbody>
            {
              user !== null ?
            Object.keys(user.courses).map((curso: string, key: number) => (
                <tr
                className={`grid grid-cols-5 p-4 ${
                  key === courses.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                  
                    <td className="col-span-1">
                      <Image src={getImage(curso)} alt="Poster" width={100} height={48} />
                    </td>
                      <td className="col-span-3 my-auto">
                        {curso[0].toUpperCase() + curso.split("_").join(" ").slice(1)}
                      </td>
                    <td className="col-span-1 my-auto">
                      {
                        buttonRender(user.courses[curso].estatus, curso, user.courses, courses)
                      }
                    </td>
                  
                </tr>
            ))
          
            :

            ""
          }  
          </tbody>

        }
      </table>
    </div>
  );
};

export default CoursesTable;

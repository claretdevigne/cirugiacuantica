import { BRAND } from "@/types/brand";
import Image from "next/image";
import DropdownDefault from "../Dropdowns/DropdownDefault";
import { useQuery } from "@tanstack/react-query";
import { getAllCourses, getAllUsers, getRequests, updateRequests, updateUser } from "@/app/lib/dbActions";
import { useEffect, useState } from "react";
import { count } from "console";

const TableStudents: React.FC = () => {

  const [requests, setRequests] = useState(0)

  const fetchingRequests = async () => {

    const token = localStorage.getItem("authToken")

    if (token) {
      return await getAllUsers(token)
        .then((res: any) => JSON.parse(res))
    }
  }

  const fetchingCourses = async () => {

    const token = localStorage.getItem("authToken")

    if (token) {
      return await getAllCourses(token)
        .then((res: any) => {
          return JSON.parse(res.courses)
        })
    }
  }

  const handleCertification = (user: any) => {
    const token = localStorage.getItem("authToken")
    if (token) {
      updateUser(token, user)
      refetch()
    }
  }

  const { isLoading, data, refetch } = useQuery({ queryKey: ["requests"], queryFn: fetchingRequests })
  const { isLoading: loading, data: coursesFetch } = useQuery({ queryKey: ["courses"], queryFn: fetchingCourses })

  const getNameOfActiveCourse = (listaCursos: any) => {

    if (!loading && coursesFetch.length) {

      const cursoActivo = Object.keys(listaCursos).filter((curso: any) => listaCursos[curso].estatus === 'activo');
      
      return cursoActivo[0][0].toUpperCase() + cursoActivo[0].split("_").join(" ").slice(1)
    }

    return
  }

  useEffect(() => {
    let counter = 0
    if (!isLoading) {
      data.map((course: any) => {
        if (true) {
        // if (course.current_courses.length) {
          counter++
        }
      })
      setRequests(counter)
    }


  }, [isLoading, data])

  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Estudiantes por curso
            </h4>
          </div>
          <button onClick={() => refetch()
          } className="bg-zinc-400 rounded-full px-4 text-white">Recargar</button>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 xl:p-4">
              <h5 className="text-sm col-span-1 font-medium uppercase xsm:text-base">
                Nombre
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Curso
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                ACCIÓN
              </h5>
            </div>
          </div>


          {

            isLoading

            ?

            <div className="my-3 text-center">LOADING...</div>

            :

            !requests

            ?

            <div className="my-3 text-center">NO HAY ESTUDIANTES ACTIVOS</div>

            :

            data.map((user: any, key: number) => {
              // Verificar si algún curso tiene un estado activo
              const cursoActivo = Object.values(user.cursos).some((curso: any) => curso.estatus === "activo");

              // Renderizar solo si hay algún curso activo
              if (cursoActivo) {
                return (
                  <div
                    className={`grid grid-cols-3 ${
                      key === data.length - 1 ? "" : "border-b border-stroke dark:border-strokedark"
                    }`}
                    key={key}
                  >
                    <div className="flex items-center p-2.5 xl:p-5">
                      <p className="font-medium text-black dark:text-white">{user.nombre}</p>
                    </div>

                    <div className="flex items-center justify-center p-2.5 xl:p-5">
                      <p className="font-medium text-meta-3">{getNameOfActiveCourse(user.cursos)}</p>
                    </div>

                    <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                      <button onClick={() => handleCertification(user)} className="bg-success text-white py-2 px-5 rounded-md">
                        CERTIFICAR
                      </button>
                    </div>
                  </div>
                );
              } else {
                return null; // No hay cursos activos, no renderizar este usuario
              }
            })

          }
        </div>
      </div>
    </div>
  );
};

export default TableStudents;

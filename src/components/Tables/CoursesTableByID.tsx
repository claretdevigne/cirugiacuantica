import Image from "next/image";
import { Product } from "@/types/product";
import { STUDENTS } from "@/types/user";
import { useQuery } from "@tanstack/react-query";

type P = {
  name: string,
  id: string,
  data: any
}

const handleCourses = (id: string) => {
  return fetch("https://172.0.0.1:5000/api/courses")
    .then(res => res.json())
    .then(res => console.log(res)
    )
}

const CoursesTableByID = (props: P) => {

  const { name, data, id } = props

  return (
    <div className="rounded-sm border mb-5 border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="max-w-full overflow-x-auto">
        <div className="text-xl text-black font-bold mb-4">
          {
            name === "current"

            ?

            "Estudiantes actuales"

            :

            "Estudiantes antiguos"
          }
        </div>
        <table className="w-full table-auto">
          <thead>
            <tr className="bg-gray-2 text-left dark:bg-meta-4">
              <th className="min-w-[220px] px-4 py-4 font-medium text-black dark:text-white xl:pl-11">
                Nombre
              </th>
              <th className="min-w-[150px] px-4 py-4 font-medium text-black dark:text-white">
                Email
              </th>
              <th className="min-w-[120px] px-4 py-4 font-medium text-black dark:text-white">
                Status
              </th>
              <th className={` ${name !== "current" ? "hidden" : ""} px-4 py-4 font-medium text-black dark:text-white`}>
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            
            {

              data.length
                ? data.map((student: STUDENTS, key: number) => (
                  <tr key={key}>
                    <td className="border-b border-[#eee] px-4 py-5 pl-9 dark:border-strokedark xl:pl-11">
                      <h5 className="font-medium text-black dark:text-white">
                        {student.name}
                      </h5>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p className="text-black dark:text-white">
                        {student.email}
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <p
                        className={`inline-flex rounded-full bg-opacity-10 px-3 py-1 text-sm font-medium ${
                          name === "current"
                            ? "bg-success text-success"
                              : "bg-yellow-500 text-yellow-700 bg-opacity-40"
                        }`}
                      >
                        {
                          name === "current"
                            ? "CURSANDO"
                              : "CURSADO"
                        }
                      </p>
                    </td>
                    <td className="border-b border-[#eee] px-4 py-5 dark:border-strokedark">
                      <div className="flex items-center space-x-3.5">
                        <button className={`${name !== "current" ? "hidden" : ""} hover:text-primary bg-success px-5 py-2 text-white rounded-md`}>
                          Confirmar
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
                  : <div className="py-5 col-span-6">Actualmente no hay estudiantes inscritos a este curso</div>
            
            }

          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CoursesTableByID;
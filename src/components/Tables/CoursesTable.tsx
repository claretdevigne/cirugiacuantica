import { getAllCourses } from "@/app/lib/dbActions";
import { COURSE } from "@/types/courses";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import CoursesLoader from "../common/CoursesLoader";


const fetchCourses = async () => {
  const token = localStorage.getItem("authToken")

    if (token) {
      return await getAllCourses(token)
      .then(res => {
        if (typeof res.courses === "string") {
          return JSON.parse(res.courses)
        }
    })
}}

const CoursesTable = () => {

  const { isLoading, isError, data: courses = [] } = useQuery({queryKey: ["courses"], queryFn: fetchCourses})

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">

      <table className="flex flex-col">
        <thead className="grid grid-cols-5 rounded-sm bg-gray-2 dark:bg-meta-4">
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
        </thead>
        
        {

          (isLoading)

          ?

          <CoursesLoader />

          :
          
          <tbody>
            {courses.map((course: COURSE, key: number) => (
          
              <>
                <tr
                className={`grid grid-cols-5 p-4 ${
                  key === courses.length - 1
                    ? ""
                    : "border-b border-stroke dark:border-strokedark"
                }`}
                key={key}
              >
                  
                    <td className="col-span-1">
                      <Image src={course.url} alt="Poster" width={100} height={48} />
                    </td>
                      <p className="col-span-3 my-auto">
                        {course.name}
                      </p>
                    <td className="col-span-1 my-auto">
                      <button className="text-white bg-yellow-500 py-4 px-6 rounded-md sm:block">
                        INSCRIBIRSE
                      </button>
                    </td>
                  
                </tr>
              </>
            ))}  
          </tbody>

        }
      </table>
    </div>
  );
};

export default CoursesTable;

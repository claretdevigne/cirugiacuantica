import { getAllCourses } from "@/app/lib/dbActions";
import { COURSE } from "@/types/courses";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";


const fetchCourses = async () => {
  const token = localStorage.getItem("authToken")
  if (token) {
    return await getAllCourses(token)
      .then(res => console.log(res.courses)
      )
  }
  // return fetch("http://127.0.0.1:5000/api/courses")
  //   .then(async res => res.json())
  //   .then(async res => res)
}

const CoursesTable = () => {

  const { isLoading, isError, data: courses = [] } = useQuery({queryKey: ["courses"], queryFn: fetchCourses})

  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
        CURSOS
      </h4>

      <div className="flex flex-col">
        <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Imagen
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Curso
            </h5>
          </div>
        </div>

        {courses.map((course: COURSE, key: number) => (
          
          <Link href={`/courses/${course._id}?name=${course.name}`}>
            <div
            className={`grid grid-cols-3 sm:grid-cols-5 ${
              key === courses.length - 1
                ? ""
                : "border-b border-stroke dark:border-strokedark"
            }`}
            key={key}
          >
              <div className="flex w-150 items-center gap-3 p-2.5 xl:p-5">
                <div className="flex-shrink-0 mr-15">
                  <Image src={course.url} alt="Poster" width={100} height={48} />
                </div>
                <p className="hidden text-black dark:text-white sm:block">
                  {course.name}
                </p>
              </div>
            </div>
          </Link>
          
          


        ))}
      </div>
    </div>
  );
};

export default CoursesTable;

'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ID_PROP } from "@/types/idprops";
import CoursesTableByID from "@/components/Tables/CoursesTableByID";
import { useQuery } from "@tanstack/react-query";
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import { useSearchParams } from "next/navigation";
import { getCoursesById, getUsersByCourseId } from "@/app/lib/dbActions";

const handleStudentsByCourseId = async (id: string) => {
  const token = localStorage.getItem("authToken")
  if (token) {
    return await getUsersByCourseId(token, id)
      .then((res: any) => res.students)
  }
}

export default function Home(props: ID_PROP) {

  const id = props.params.id
  const params = useSearchParams()
  const { isLoading, error: err, data: students = []} = useQuery({queryKey: ["students"], queryFn: () => handleStudentsByCourseId(id)})

  return (
      <DefaultLayout>
            <Breadcrumb pageName={params.get("name")} types="cursos"/>
            {
              (isLoading)
                ?
                  <></>

                  :
                  <>
                    <CoursesTableByID id={id} name="current" data={students.current_students}/>
                    <CoursesTableByID id={id} name="old" data={students.old_students}/>
                  </>
            }
            
      </DefaultLayout>
  );
}
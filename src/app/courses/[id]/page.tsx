'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { ID_PROP } from "@/types/idprops";
import CoursesTableByID from "@/components/Tables/CoursesTableByID";
import { useQuery } from "@tanstack/react-query";

const handleFetch = async (id: string) => {
  return await fetch(`http://127.0.0.1:5000/api/courses/${id}`)
    .then(res => res.json())
    .then(res => res)
}

const handleCourses = async (id: string) => {
  return await fetch(`http://127.0.0.1:5000/api/courses/`)
    .then(res => res.json())
    .then(res => res.filter((course: any) => course._id === id))
}

export default function Home(props: ID_PROP) {

  const id = props.params.id
  const { isLoading, error, data = []} = useQuery({queryKey: ["coursesByID"], queryFn: () => handleFetch(id)})
  const { isLoading: loading, error: err, data: courses} = useQuery({queryKey: ["courses"], queryFn: () => handleCourses(id)})  

  return (
      <DefaultLayout>
        {
          !isLoading 
            ?
          <>
            {courses.map((course: any) => (
              <div className="bg-white text-zinc-500 py-4 px-6 text-2xl mb-4 border border-zinc-200 shadow-4 shadow-zinc-200">{ course.name }</div>
            ))}
            <CoursesTableByID id={id} name="current" data={data.currentStudents}/>
            <CoursesTableByID id={id} name="old" data={data.oldStudents}/>
          </>
          :
          <h1>LOADING...</h1>
        }
      </DefaultLayout>
  );
}
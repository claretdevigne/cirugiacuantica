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

export default function Home(props: ID_PROP) {

  const id = props.params.id
  const { isLoading, error, data = []} = useQuery({queryKey: ["coursesByID"], queryFn: () => handleFetch(id)})
  console.log(data);
  

  return (
      <DefaultLayout>
        {
          !isLoading 
            ?
          <>
            <CoursesTableByID id={id} name="current" data={data.currentStudents}/>
            <CoursesTableByID id={id} name="old" data={data.oldStudents}/>
          </>
          :
          <h1>LOADING...</h1>
        }
      </DefaultLayout>
  );
}
'use client'
import { getAllCourses } from "@/app/lib/dbActions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableManageCourses from "@/components/Tables/TableManageCourses";
import { Modal } from "@/components/common/Modal";
import { useManageCoursesStore } from "@/reducers/store";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";

const fetchAllCourses = async () => {
  const token = localStorage.getItem("authToken")
  if (token) {
    return await getAllCourses(token)
      .then(res => res.courses)
  }
}

export default function Home() {
  const [id, setId] = useState()
  const [modalDefinition, setModalDefinition] = useState("edit")
  const { isLoading, error, data } = useQuery({queryKey: ["courses"], queryFn: fetchAllCourses})

  // ----- CONFIGURAR LA CARGA DE LOS CURSOS

  //TODO: CUANDO SE ACTIVA EL MODAL ENVIA EL CURSO EN BASE AL ID
  //TODO: DEFINIR PROP PARA CONTENIDO DEL MODAL (EDITAR, CREAR, ELIMINAR)

  const course = {
    _id: 1,
    url: "google.com",
    name: "CURSO 1",
    status: true,
    requirements: []
  }

  const activator = (id: any, typeOfCourse: string) => {
    if (typeOfCourse === "edit" || typeOfCourse === "delete") {
      setId(id)
    }

    setModalDefinition(typeOfCourse)
  }

  const store = useManageCoursesStore()


  return (
    <>
      <DefaultLayout>
        <Modal course={course} definition={modalDefinition} />
        <TableManageCourses coursesList={ data } activator={activator} />
      </DefaultLayout>
    </>
  );
}

'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableManageCourses from "@/components/Tables/TableManageCourses";
import { Modal } from "@/components/common/Modal";
import { useState } from "react";

export default function Home() {

  const [activeModal, setActiveModal] = useState(false)
  const [id, setId] = useState()
  const [modalDefinition, setModalDefinition] = useState("edit")

  //TODO: GET COURSES
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
    setActiveModal(true)
  }

  return (
    <>
      <DefaultLayout>
        <Modal course={course} deactivate={setActiveModal} active={activeModal} definition={modalDefinition} />
        <TableManageCourses activator={activator} />
      </DefaultLayout>
    </>
  );
}

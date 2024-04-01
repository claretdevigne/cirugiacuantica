'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CoursesTable from "@/components/Tables/CoursesTable";


//TODO: ---------------- CONFIGURAR HEADER Y BARRA -----------------------

export default function Home() {

  return (
    <>
      <DefaultLayout>
        <CoursesTable/>
      </DefaultLayout>
    </>
  );
}

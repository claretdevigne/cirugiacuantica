'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CoursesTable from "@/components/Tables/CoursesTable";

export default function Home() {


  return (
    <>
      <DefaultLayout>
        {
          //TODO: REPARAR BREADCUMB
        }
        <Breadcrumb pageName="Cursos" types="cursos" />
        <CoursesTable/>
      </DefaultLayout>
    </>
  );
}

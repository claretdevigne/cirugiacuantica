'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableListaEstudiantes from "@/components/Tables/TableListaEstudiantes";

export default function Page() {

  return (
      <DefaultLayout>
        
        <Breadcrumb pageName="Estudiantes" types="database"/>
        <TableListaEstudiantes />
      </DefaultLayout>
  );
}

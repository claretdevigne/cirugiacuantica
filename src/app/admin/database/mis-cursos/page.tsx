'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableMisCursos from "@/components/Tables/TableMisCursos";

export default function Page() {

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Mis cursos" types="database"/>
        <TableMisCursos />
      </DefaultLayout>
  );
}

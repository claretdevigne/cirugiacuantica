'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableListaMisEstudiantes from "@/components/Tables/TableListaMisEstudiantes";

export default function Page() {

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Mis estudiantes" types="database"/>
        <TableListaMisEstudiantes />
      </DefaultLayout>
  );
}

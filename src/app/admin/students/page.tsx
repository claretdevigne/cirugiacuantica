'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableRequests from "@/components/Tables/TableRequests";
import TableStudents from "@/components/Tables/TableStudents";

export default function Page() {

  return (
    <DefaultLayout>
      <Breadcrumb pageName="Estudiantes" types="admin"/>
      <TableStudents />
    </DefaultLayout>
  );
}

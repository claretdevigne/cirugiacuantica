'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableCourses from "@/components/Tables/TableCourses";

export default function Page() {

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Cursos" types="database"/>
        <TableCourses />
      </DefaultLayout>
  );
}

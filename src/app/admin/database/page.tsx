'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDatabase from "@/components/Tables/TableDatabase";

export default function Page() {

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Bases de datos" types="admin"/>
        <TableDatabase />
      </DefaultLayout>
  );
}

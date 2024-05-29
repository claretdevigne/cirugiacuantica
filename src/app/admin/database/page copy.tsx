'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableDatabase from "@/components/Tables/TableDatabase";
import TableOne from "@/components/Tables/TableOne";

export default function Page() {

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Base de datos" types="admin"/>
        <TableOne />
      </DefaultLayout>
  );
}

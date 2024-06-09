'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableListaFacilitadores from "@/components/Tables/TableFacilitadores";

export default function Page() {

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Facilitadores" types="database"/>
        <TableListaFacilitadores />
      </DefaultLayout>
  );
}

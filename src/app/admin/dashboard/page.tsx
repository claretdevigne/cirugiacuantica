'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableRequests from "@/components/Tables/TableRequests";

export default function Page() {

  return (
      <DefaultLayout>
        <Breadcrumb pageName="Dashboard" types="admin"/>
        <TableRequests />
        <h1>ADMIN DASHBOARD</h1>
      </DefaultLayout>
  );
}

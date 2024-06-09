'use client'
import Breadcrumb from "@/components/Breadcrumbs/Breadcrumb";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import ProfileTable from "@/components/Tables/ProfileTable";

export default function Home() {


  return (
    <>
      <DefaultLayout>
        <Breadcrumb pageName="Perfil" types="perfil" />
        <ProfileTable/>
      </DefaultLayout>
    </>
  );
}

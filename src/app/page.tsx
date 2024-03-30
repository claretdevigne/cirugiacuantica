'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CoursesTable from "@/components/Tables/CoursesTable";


export default function Home() {

  return (
    <>
      <DefaultLayout>
        <CoursesTable/>
      </DefaultLayout>
    </>
  );
}

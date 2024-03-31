'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import CoursesTable from "@/components/Tables/CoursesTable";


export default function Page() {

  return (
      <DefaultLayout>
        <CoursesTable/>
      </DefaultLayout>
  );
}

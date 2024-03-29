'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
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

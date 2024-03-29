'use client'
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useStore } from "@/reducers/store";
import CoursesTable from "@/components/Tables/CoursesTable";


export default function Home() {

  const [auth, setAuth] = useState(false)
  const route = useRouter()
  const { setData } = useStore()
  

  const authenticate = () => {
    const authToken = localStorage.getItem("authToken")
    if (authToken) {
      setAuth(true)
    } else {
      route.push("/auth/signin")
    }
  }
  
  useEffect(() => {
    authenticate()
  }, [])

  if (!auth) {
    return null
  }

  return (
    <>
      <DefaultLayout>
        <CoursesTable/>
      </DefaultLayout>
    </>
  );
}

'use client'
import { getAllCourses } from "@/app/lib/dbActions";
import DefaultLayout from "@/components/Layouts/DefaultLayout";
import TableManageCourses from "@/components/Tables/TableManageCourses";
import { Modal } from "@/components/common/Modal";
import { useManageCoursesStore } from "@/reducers/store";
import { COURSE } from "@/types/courses";
import { useEffect, useState } from "react";

const fetchAllCourses = async () => {
  const token = localStorage.getItem("authToken")
  if (token) {
    return await getAllCourses(token)
      .then(res => res.courses)
  }
}

export default function Home() {

  const { setCourses, setRequirements, modalIsActive } = useManageCoursesStore()

  useEffect(() => {

    fetchAllCourses()
      .then(res => {
        if (res) {
          const courses = JSON.parse(res)
          setCourses(courses)

          const requirementsList: { id: any, name: string}[] = []
          courses.map((course: COURSE) => {
            requirementsList.push({
              id: course._id,
              name: course.name
            })
          })

          setRequirements(requirementsList)
        }
      })
  }, [modalIsActive, setCourses, setRequirements])

  return (
    <>
      <DefaultLayout>
        <Modal />
        <TableManageCourses />
      </DefaultLayout>
    </>
  );
}

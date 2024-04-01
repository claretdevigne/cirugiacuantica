import { createCourse } from "@/app/lib/dbActions"
import SelectRequirements from "@/components/SelectGroup/SelectRequirements"
import SwitcherFour from "@/components/Switchers/SwitcherFour"
import { useManageCoursesStore } from "@/reducers/store"
import { useState } from "react"

export const AddCourse = () => {

  const [clean, setClean] = useState<boolean>()
  const { modalToggle } = useManageCoursesStore()

  const handleAddCourse = (e: any) => {
    e.preventDefault()

    const name = e.target.name.value
    const url = e.target.url.value
    const status = e.target.status.value === "true" ? true : false 
    const requirements = e.target.requirements.value

    if (name && url) {
      const token = localStorage.getItem("authToken")

      const newCourse = {
        name: name,
        url: url,
        status: status,
        requirements: requirements
      }

      if (token) {
        createCourse(token, newCourse)
          .then(res => {
            if (res?.status === 201) {
              modalToggle()
            } else {
              setClean(false)
            }
          })
      }

    }
    
  }

    return (
        <form onSubmit={ (e) => handleAddCourse(e) } className="rounded-sm p-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  NOMBRE
                </label>
                <input
                  required
                  name="name"
                  type="text"
                  placeholder="Nombre del curso"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div className="mt-4">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  URL IMAGEN
                </label>
                <input
                  required
                  name="url"
                  type="text"
                  placeholder="URL de la imagen"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div className="flex items-center mt-4 text-sm font-medium text-black dark:text-white">
                <p className="mr-5">STATUS</p>
                <SwitcherFour />
            </div>

            <div className="mt-5">
                <SelectRequirements />
            </div>

            <div className="flex justify-center my-3">
                <input className="text-white bg-yellow-500 border-yellow-500 py-2 px-8 rounded-md cursor-pointer hover:opacity-90 hover:text-zinc-400" type="submit" value="Guardar" />
            </div>
            
        </form>
    )
}
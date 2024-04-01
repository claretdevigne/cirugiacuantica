import { updateCourse } from "@/app/lib/dbActions"
import EditSelectRequirements from "@/components/SelectGroup/EditSelectRequirements"
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo"
import SelectRequirements from "@/components/SelectGroup/SelectRequirements"
import EditSwitcher from "@/components/Switchers/EditSwitcher"
import SwitcherFour from "@/components/Switchers/SwitcherFour"
import { useManageCoursesStore } from "@/reducers/store"
import { useState } from "react"

export const EditCourse = () => {

    const course = useManageCoursesStore().selectedCourse
    const toggle = useManageCoursesStore().modalToggle
    const [clean, setClean] = useState<boolean>()
    const [courseName, setCourseName] = useState(course.name)
    const [courseUrl, setcourseUrl] = useState(course.url)
    const [courseStatus, setCourseStatus] = useState(course.status)
    const [courseRequirement, setCourseRequirement] = useState(course.requirements)
    
    const handleSaveEdits = (e: any) => {

      e.preventDefault()
      const name = courseName
      const url = courseUrl
      const status = courseStatus
      const req = courseRequirement

      if (name && url ) {
        const token = localStorage.getItem("authToken")

        const courseEdited = {
          _id: course._id,
          name: name,
          url: url,
          status: status,
          requirements: req
        }
        

        if (token) {
          updateCourse(token, courseEdited)
            .then(res => {
              if (res?.status === 201) {
                console.log("CAMBIOS GUARDADOS");
                
                toggle()
                setClean(true)
              } else {
                setClean(false)
              }
            })
        }
      
    }}

    return (
        <form className="rounded-sm p-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  NOMBRE
                </label>
                <input
                  name="name"
                  onChange={ (e) => { setCourseName(e.target.value) }}
                  type="text"
                  value={ courseName }
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div className="mt-4">
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  URL IMAGEN
                </label>
                <input
                  name="url"
                  onChange={e => setcourseUrl(e.target.value)}
                  type="text"
                  value={ courseUrl }
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div className="flex items-center mt-4 text-sm font-medium text-black dark:text-white">
                <p className="mr-5">STATUS</p>
                <EditSwitcher enable={ courseStatus } setStatus={ setCourseStatus }/>
            </div>

            <div className="mt-5">
                <EditSelectRequirements selected={ courseRequirement } setSelected={ setCourseRequirement } />
            </div>

            <div className="flex justify-center my-3">
                <input onClick={ e => handleSaveEdits(e) } className="text-white bg-yellow-500 border-yellow-500 py-2 px-8 rounded-md cursor-pointer hover:opacity-90 hover:text-zinc-400" type="submit" value="Guardar" />
            </div>
            
        </form>
    )
}
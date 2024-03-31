import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo"
import SwitcherFour from "@/components/Switchers/SwitcherFour"
import { useManageCoursesStore } from "@/reducers/store"
import { useState } from "react"

export const EditCourse = () => {

    const course = useManageCoursesStore().selectedCourse
    const [courseName, setCourseName] = useState(course.name)
    const [courseUrl, setcourseUrl] = useState(course.url)

    return (
        <form className="rounded-sm p-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                  NOMBRE
                </label>
                <input
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
                  onChange={e => setcourseUrl(e.target.value)}
                  type="text"
                  value={ courseUrl }
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <div className="flex items-center mt-4 text-sm font-medium text-black dark:text-white">
                <p className="mr-5">STATUS</p>
                <SwitcherFour enable={ course.status } />
            </div>

            <div className="mt-5">
                <SelectGroupTwo name="REQUERIMIENTOS" cursos={ course } />
            </div>

            <div className="flex justify-center my-3">
                <input className="text-white bg-yellow-500 border-yellow-500 py-2 px-8 rounded-md cursor-pointer hover:opacity-90 hover:text-zinc-400" type="submit" value="Guardar" />
            </div>
            
        </form>
    )
}
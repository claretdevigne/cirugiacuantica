import { deleteCourse } from "@/app/lib/dbActions"
import MultiSelect from "@/components/FormElements/MultiSelect"
import SelectGroupTwo from "@/components/SelectGroup/SelectGroupTwo"
import SwitcherFour from "@/components/Switchers/SwitcherFour"
import SwitcherOne from "@/components/Switchers/SwitcherOne"
import SwitcherThree from "@/components/Switchers/SwitcherThree"
import SwitcherTwo from "@/components/Switchers/SwitcherTwo"
import { useManageCoursesStore } from "@/reducers/store"

export const DeleteCourse = () => {

  const { selectedCourse, modalToggle } = useManageCoursesStore()

  const handleDeleteCourse = (e: any) => {
    e.preventDefault()
    const validationPhrase = e.target.validation.value

    if (validationPhrase === selectedCourse.name.toUpperCase()) {
      const token = localStorage.getItem("authToken")

      if(token) {
        deleteCourse(token, selectedCourse._id)
          .then(res => {
            if (res?.status === 404) {
              modalToggle()
            }
          })
      }
    }
    
    
  }

    return (
        <form onSubmit={(e) => handleDeleteCourse(e) } className="rounded-sm p-5 border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div>
                <label className="mb-3 block text-sm font-medium text-black dark:text-white">
                   {
                    `INGRESE LA FRASE: "${selectedCourse.name.toUpperCase()}" en mayúsculas`
                   }
                </label>
                <input
                  name="validation"
                  type="text"
                  placeholder="Ingrese la frase para eliminar el curso"
                  className="w-full rounded-lg border-[1.5px] border-stroke bg-transparent px-5 py-3 text-black outline-none transition focus:border-primary active:border-primary disabled:cursor-default disabled:bg-whiter dark:border-form-strokedark dark:bg-form-input dark:text-white dark:focus:border-primary"
                />
            </div>

            <p className="my-3 text-center text-danger">Está a punto de eliminar un curso, esta acción no se puede deshacer, por favor continúe con precaución.</p>

            <div className="flex justify-center my-3">
                <input className="text-white bg-danger border-danger py-2 px-8 rounded-md cursor-pointer hover:opacity-90 hover:text-zinc-400" type="submit" value="Eliminar" />
            </div>
            
        </form>
    )
}
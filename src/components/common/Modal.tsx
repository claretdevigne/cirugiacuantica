import { AddCourse } from "@/app/admin/manage/courses/addCourse"
import { DeleteCourse } from "@/app/admin/manage/courses/deleteCourse"
import { EditCourse } from "@/app/admin/manage/courses/editCourse"
import { useManageCoursesStore } from "@/reducers/store"

export const Modal = ( props: any )  => {

    const { modalIsActive, modalToggle, modalDefinition } = useManageCoursesStore()

    return (
        <>
            {
                modalIsActive
                
                ?

                <div id="myModal" className="modal fixed w-full h-full top-0 left-0 flex items-center justify-center">
                    <div className="modal-overlay absolute w-full h-full bg-zinc-500 opacity-30 "></div>
                    
                        <div className="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded shadow-lg z-50 overflow-y-auto">
                            
                            <div className="modal-content py-4 text-left px-6">
                            
                            <div className="flex justify-between items-center pb-3">
                                <p className="text-2xl font-bold">
                                    {
                                        props.definition === "edit"
                                            ? "Editar Curso"
                                                : props.definition === "add"
                                                    ? "Agregar Curso" 
                                                        : ""
                                    }
                                </p>
                                <button onClick={modalToggle} id="closeModalBtn" className="modal-close cursor-pointer z-50">
                                {
                                    //TODO: CORREGIR SVG NO SE VE.
                                }
                                <svg className="fill-current text-black" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 18 18">
                                    <path d="M1 1l16 16m0-16L1 17"></path>
                                </svg>
                                </button>
                            </div>
                            
                            {
                                modalDefinition === "add"
                                    ? <AddCourse />
                                      : modalDefinition === "edit"
                                        ? <EditCourse />
                                            : modalDefinition === "delete"
                                                ? <DeleteCourse />
                                                    : ""
                            }
                            

                        </div>
                    </div>
                </div>

                :

                ""

            }
            
        </>
    )
}
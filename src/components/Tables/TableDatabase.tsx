import DropdownDefault from "../Dropdowns/DropdownDefault";
// import { useQuery } from "@tanstack/react-query";
// import { getRequests, updateRequests } from "@/app/lib/dbActions";

const TableDatabase: React.FC = () => {

  // const fetchingRequests = async () => {

  //   const token = localStorage.getItem("authToken")

  //   if (token) {
  //     return await getRequests(token)
  //       .then((res: any) => JSON.parse(res.data))
  //   }
  // }

  // const handleConfirmation = (request: any) => {
  //   const token = localStorage.getItem("authToken")

  //   if (token) {
  //     updateRequests(token, request)
  //   }

  //   refetch()
  // }

  // const { isLoading, data, refetch } = useQuery({ queryKey: ["requests"], queryFn: fetchingRequests })

  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex justify-between">
        </div>

        <div className="flex flex-col">
          {/* <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
            <div className="p-2.5 xl:p-4">
              <h5 className="text-sm col-span-1 font-medium uppercase xsm:text-base">
                Nombre
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                Curso
              </h5>
            </div>
            <div className="p-2.5 text-center xl:p-4">
              <h5 className="text-sm font-medium uppercase xsm:text-base">
                ACCIÓN
              </h5>
            </div>
          </div> */}    
          
          <div>

              <div className="flex items-center p-2.5 xl:p-5">
                <p className="font-medium text-black dark:text-white">
                  Mis estudiantes
                </p>
              </div>

              <div className="flex items-center p-2.5 xl:p-5">
                <p className="font-medium text-black dark:text-white">
                  Listado total de estudiantes
                </p>
              </div>
              
              <div className="flex items-center p-2.5 xl:p-5">
                <p className="font-medium text-black dark:text-white">
                  Lista de facilitadores
                </p>
              </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default TableDatabase;

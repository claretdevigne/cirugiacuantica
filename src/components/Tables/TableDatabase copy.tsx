import DropdownDefault from "../Dropdowns/DropdownDefault";
import { useQuery } from "@tanstack/react-query";
import { getRequests, updateRequests } from "@/app/lib/dbActions";

const TableRequests: React.FC = () => {

  const fetchingRequests = async () => {

    const token = localStorage.getItem("authToken")

    if (token) {
      return await getRequests(token)
        .then((res: any) => JSON.parse(res.data))
    }
  }

  const handleConfirmation = (request: any) => {
    const token = localStorage.getItem("authToken")

    if (token) {
      updateRequests(token, request)
    }

    refetch()
  }

  const { isLoading, data, refetch } = useQuery({ queryKey: ["requests"], queryFn: fetchingRequests })

  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Base de datos
            </h4>
          </div>
          <button onClick={() => refetch()} className="bg-zinc-400 rounded-full px-4 text-white">Recargar</button>
        </div>

        <div className="flex flex-col">
          <div className="grid grid-cols-3 rounded-sm bg-gray-2 dark:bg-meta-4">
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
          </div>

          {

            isLoading

            ?

            <div className="my-3 text-center">LOADING...</div>

            :

            !data.length

            ?

            <div className="my-3 text-center">NO HAY PETICIONES</div>

            :
          
          data.map((request: any, key: number) => (

            <div
              className={`grid grid-cols-3 ${
                key === data.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={key}
            >

              <div className="flex items-center p-2.5 xl:p-5">
                <p className="font-medium text-black dark:text-white">
                  {request.userName}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="font-medium text-meta-3">{request.courseName}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <button onClick={ () => handleConfirmation(request) } className="bg-success text-white py-2 px-5 rounded-md">CONFIRMAR</button>
              </div>
            </div>

            
          ))
          
          }
        </div>
      </div>
    </div>
  );
};

export default TableRequests;

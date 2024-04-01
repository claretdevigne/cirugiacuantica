import { BRAND } from "@/types/brand";
import Image from "next/image";
import DropdownDefault from "../Dropdowns/DropdownDefault";

const requestData: any[] = [
  {
    name: "Juan Pérez",
    course: "TAL CURSO",
    confirmation: false
  },
  
];

const TableRequests: React.FC = () => {
  return (
    <div className="col-span-12 xl:col-span-7">
      <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="mb-6 flex justify-between">
          <div>
            <h4 className="text-title-sm2 font-bold text-black dark:text-white">
              Peticiones
            </h4>
          </div>
          <DropdownDefault />
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

          {requestData.map((request, key) => (
            <div
              className={`grid grid-cols-3 ${
                key === requestData.length - 1
                  ? ""
                  : "border-b border-stroke dark:border-strokedark"
              }`}
              key={key}
            >

              <div className="flex items-center p-2.5 xl:p-5">
                <p className="font-medium text-black dark:text-white">
                  {request.name}
                </p>
              </div>

              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="font-medium text-meta-3">{request.course}</p>
              </div>

              <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                <button className="bg-success text-white py-2 px-5 rounded-md">CONFIRMAR</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TableRequests;

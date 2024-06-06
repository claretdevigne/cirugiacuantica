import React, { useState } from 'react';
import { Query, useQuery, useMutation } from '@tanstack/react-query';
import { getFacilitadores, addFacilitadores, deleteFacilitadores, updateFacilitadores } from '@/app/lib/dbActions';

type Cursos = {
  [name: string]: {
    habilitado: boolean;
  },
}

type Facilitador = {
  _id: string,
  nombre: string,
  email: string,
  telefono: number | null,
  pais: string,
  cursos: Cursos,
  estatus: boolean,
  estudiantes: Array<string>,
  facilitadores: Array<string>
}

const fetchCourses = async () => {
  const response = await getFacilitadores()
  return JSON.parse(response)
};

const TableOne = () => {
  const { isLoading, data: facilitadores, refetch } = useQuery({queryKey: ["courses"], queryFn: fetchCourses});
  const [expandedFacilitador, setExpandedCourse] = useState(null);
  const [editFacilitador, setEditFacilitador] = useState(null);
  const [facilitadorName, setFacilitadorName] = useState('');
  const [facilitadorEmail, setFacilitadorEmail] = useState<string>("");
  const [facilitadorPais, setFacilitadorPais] = useState<string>("");
  const [facilitadorTelefono, setFacilitadorTelefono] = useState<string>("");
  const [facilitadorCourses, setFacilitadorCourses] = useState<Cursos>();
  const [deleteCourse, setDeleteCourse] = useState<Facilitador | null>(null);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseStatus, setNewCourseStatus] = useState<Cursos>();
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const toggleDetails = (facilitadorId: any) => {
    setExpandedCourse(expandedFacilitador === facilitadorId ? null : facilitadorId);
  };

  const filteredFacilitadores = facilitadores?.filter((facilitador: Facilitador) =>
    facilitador?.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (facilitador: any) => {
    setEditFacilitador(facilitador._id);
    setFacilitadorName(facilitador.nombre);
    setFacilitadorEmail(facilitador.email);
    setFacilitadorPais(facilitador.pais);
    setFacilitadorTelefono(facilitador.telefono);
    setFacilitadorCourses(facilitador.cursos);
  };

  const handleEnableCourses = (id: string, name: string, value: string) => {
    let currentCourse = facilitadorCourses
    
    if (currentCourse && value === "true") {
      currentCourse[name].habilitado = true;
    } else if (currentCourse && value === "false") {
      currentCourse[name].habilitado = false;
    }

    setFacilitadorCourses(currentCourse);
  }

  const saveEdit = async (id: string) => {
    setEditFacilitador(null);
    updateFacilitadores(id, facilitadorName, facilitadorEmail, facilitadorPais, facilitadorTelefono, facilitadorCourses);
    await refetch();
  };

  // const openDeleteModal = (course: any) => {
  //   setDeleteCourse(course);
  //   setConfirmDelete('');
  // };

  // const handleDelete = async () => {
  //   if (deleteCourse !== undefined && deleteCourse !== null && deleteCourse.name === confirmDelete) {
  //     deleteFacilitadores(deleteCourse._id)
  //     setDeleteCourse(null)
  //     await refetch();
  //   }
  // };

  // const handleAddCourse = async () => {
  //   addFacilitadores(newCourseName, newCourseStatus)
  //   refetch()
  // };


  return (
    <div className="rounded-sm border border-stroke bg-white px-5 pb-2.5 pt-6 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
      <div className="flex justify-between items-center mb-4">
        <input
          type="text"
          placeholder="Buscar por nombre"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="px-4 py-2 border rounded-md"
        />
      </div>
      <div className="flex flex-col">
        <div className="grid grid-cols-4 rounded-sm bg-gray-2 dark:bg-meta-4">
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Curso
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              País
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ver detalles
            </h5>
          </div>
        </div>

        {
          facilitadores === undefined
          ?
          ""
          :
        
        filteredFacilitadores.map((facilitador: Facilitador) => (
          <div key={facilitador._id}>
            <div className={`grid grid-cols-4 border-b border-stroke dark:border-strokedark`}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                {editFacilitador === facilitador._id ? (
                  <input
                    type="text"
                    value={facilitadorName}
                    onChange={(e) => setFacilitadorName(e.target.value)}
                    className="border rounded p-2"
                  />
                ) : (
                  <p className="text-black dark:text-white">{facilitador.nombre}</p>
                )}
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                {editFacilitador === facilitador._id ? (
                  <input
                  type='text'
                    value={facilitadorEmail}
                    onChange={(e) => setFacilitadorEmail(e.target.value)}
                    className="border rounded p-2"
                  >
                  </input>
                ) : (
                  <p className="text-black dark:text-white">{facilitador.email}</p>
                )}
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                {editFacilitador == facilitador._id ? (
                  <input
                    type="text"
                    value={facilitadorPais}
                    onChange={(e) => setFacilitadorPais(e.target.value)}
                    className="border rounded p-2"
                  />
                ) : 
                  <p className="text-black dark:text-white">{facilitador.pais}</p>
                }
                
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <button
                  onClick={() => toggleDetails(facilitador._id)}
                  className="text-blue-500 hover:underline"
                >
                  {expandedFacilitador === facilitador._id ? "Ocultar detalles" : "Ver detalles"}
                </button>
              </div>
            </div>

            {expandedFacilitador === facilitador._id && (
              <div className="bg-gray-100 p-4 dark:bg-gray-800">
                <h5 className="text-sm font-medium">Cursos habilitados:</h5>
                <ul className="list-disc list-inside">
                  {
                    Object.keys(facilitador.cursos).length === 0 

                    ?
                    
                    "No hay cursos activos"
                  
                    :

                  // TODO: CORREGIR
                  Object.entries(facilitador.cursos).map(([curso, { habilitado }]) => {
                    if (editFacilitador === facilitador._id) {
                      return (
                        <>
                          <li key={curso}>{curso[0].toUpperCase() + curso.split("_").join(" ").slice(1)}</li>
                          <select value={ "" + habilitado } onChange={(e) => handleEnableCourses(facilitador._id, curso, e.target.value)}>
                            <option value={"true"}>Habilitado</option>
                            <option value={"false"}>Desabilitado</option>
                          </select>
                        </>
                      );
                    } else if (habilitado) {
                      return (    
                        <li key={curso}>{curso[0].toUpperCase() + curso.split("_").join(" ").slice(1)}</li>
                      );
                    }
                    })
                }
                </ul>

                <h5 className="text-sm font-medium mt-4"></h5>
                <h5 className="text-sm font-medium">Telefono:</h5>
                <ul className="list-disc list-inside">
                {editFacilitador == facilitador._id ? (
                  <input
                    type="text"
                    value={facilitadorTelefono}
                    onChange={(e) => setFacilitadorTelefono(e.target.value)}
                    className="border rounded p-2"
                  />
                ) : 
                  <p className="text-black dark:text-white">{facilitador.telefono}</p>
                }
                </ul>
                
                {editFacilitador === facilitador._id ? (
                  <>
                    <button
                      onClick={() => saveEdit(facilitador._id)}
                      className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                    >
                      Guardar
                    </button>

                    <button
                      onClick={() => setEditFacilitador(null)}
                      className="mt-4 ml-2 px-4 py-2 bg-slate-500 text-white rounded"
                    >
                      Cancelar
                    </button>

                  </>                  
                ) : (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => startEdit(facilitador)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Editar
                    </button>
                    {/* <button
                      // onClick={() => openDeleteModal(facilitador)}
                      className="px-4 py-2 bg-red text-white rounded"
                    >
                      Eliminar
                    </button> */}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {/* <div className="mt-6">
          <h3 className="text-lg font-medium">Agregar nuevo facilitador</h3>
          <div className="grid grid-cols-2 gap-4 mt-4">
            <input
              type="text"
              placeholder="Nombre del curso"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="border rounded p-2"
            />
            <select
              value={newCourseStatus}
              onChange={(e) => setNewCourseStatus(e.target.value)}
              className="border rounded p-2"
            >
              <option value={"true"}>Activo</option>
              <option value={"false"}>Inactivo</option>
            </select>
          </div>
          <button
            onClick={handleAddCourse}
            className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
          >
            Agregar nuevo facilitador
          </button>
        </div> */}
      </div>

      {/* {deleteCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-lg dark:bg-gray-800">
            <h3 className="text-lg font-medium mb-4">Eliminar curso</h3>
            <p className="mb-4">Escriba <strong>{deleteCourse.name}</strong> para eliminar el curso.</p>
            <input
              type="text"
              value={confirmDelete}
              onChange={(e) => setConfirmDelete(e.target.value)}
              className="border rounded p-2 w-full mb-4"
            />
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => setDeleteCourse(null)}
                className="px-4 py-2 bg-gray-300 text-black rounded"
              >
                Cancelar
              </button>
              <button
                // onClick={handleDelete}
                className="px-4 py-2 bg-red text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )} */}
    </div>
  );
};

export default TableOne;

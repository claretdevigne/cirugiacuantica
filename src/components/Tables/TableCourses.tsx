import React, { useState } from 'react';
import { Query, useQuery, useMutation } from '@tanstack/react-query';
import { getCourses, addCourse, deleteCourses, editCourses } from '@/app/lib/dbActions';

type Course = {
  _id: string,
  name: string,
  estatus: boolean,
  estudiantes: Array<string>,
  facilitadores: Array<string>
}

const fetchCourses = async () => {
  const response = await getCourses()
  return JSON.parse(response)
};

const TableOne = () => {
  const { isLoading, data: courses, refetch } = useQuery({queryKey: ["courses"], queryFn: fetchCourses});
  const [expandedCourse, setExpandedCourse] = useState(null);
  const [editCourse, setEditCourse] = useState(null);
  const [courseName, setCourseName] = useState('');
  const [courseStatus, setCourseStatus] = useState<string>("true");
  const [deleteCourse, setDeleteCourse] = useState<Course | null>(null);
  const [confirmDelete, setConfirmDelete] = useState('');
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseStatus, setNewCourseStatus] = useState<string>("true");
  const [searchTerm, setSearchTerm] = useState("");

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const toggleDetails = (courseId: any) => {
    setExpandedCourse(expandedCourse === courseId ? null : courseId);
  };

  const filteredCourses = courses?.filter((course: Course) =>
    course.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const startEdit = (course: any) => {
    setEditCourse(course._id);
    setCourseName(course.name);
    setCourseStatus(course.estatus);
  };

  const saveEdit = async (courseId: any) => {
    // Aquí puedes agregar la lógica para guardar los cambios en el curso
    // Ej. Actualizar el estado local o hacer una petición a la API
    setEditCourse(null);
    editCourses(courseId, courseName, courseStatus);
    await refetch();
  };

  const openDeleteModal = (course: any) => {
    setDeleteCourse(course);
    setConfirmDelete('');
  };

  const handleDelete = async () => {
    if (deleteCourse !== undefined && deleteCourse !== null && deleteCourse.name === confirmDelete) {
      deleteCourses(deleteCourse._id)
      setDeleteCourse(null)
      await refetch();
    }
  };

  const handleAddCourse = async () => {
    addCourse(newCourseName, newCourseStatus)
    refetch()
  };

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
              Estatus
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Estudiantes
            </h5>
          </div>
          <div className="p-2.5 text-center xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ver detalles
            </h5>
          </div>
        </div>

        {
          courses === undefined
          ?
          ""
          :
        
        filteredCourses.map((course: Course) => (
          <div key={course._id}>
            <div className={`grid grid-cols-4 border-b border-stroke dark:border-strokedark`}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                {editCourse === course._id ? (
                  <input
                    type="text"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="border rounded p-2"
                  />
                ) : (
                  <p className="text-black dark:text-white">{course.name}</p>
                )}
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                {editCourse === course._id ? (
                  <select
                    value={courseStatus}
                    onChange={(e) => setCourseStatus(e.target.value)}
                    className="border rounded p-2"
                  >
                    <option value={"true"}>Activo</option>
                    <option value={"false"}>Inactivo</option>
                  </select>
                ) : (
                  <p className="text-black dark:text-white">{course.estatus ? "Activo" : "Inactivo"}</p>
                )}
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{course.estudiantes.length}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <button
                  onClick={() => toggleDetails(course._id)}
                  className="text-blue-500 hover:underline"
                >
                  {expandedCourse === course._id ? "Ocultar detalles" : "Ver detalles"}
                </button>
              </div>
            </div>

            {expandedCourse === course._id && (
              <div className="bg-gray-100 p-4 dark:bg-gray-800">
                <h5 className="text-sm font-medium">Estudiantes:</h5>
                <ul className="list-disc list-inside">
                  {
                    course.estudiantes.length == 0 

                    ?
                    
                    "No hay estudiantes activos"
                  
                    :

                  course.estudiantes.map((student: any, index: number) => (
                    <li key={index}>{student}</li>
                  ))}
                </ul>
                <h5 className="text-sm font-medium mt-4">Facilitadores:</h5>
                <ul className="list-disc list-inside">
                  {
                  
                    course.facilitadores.length == 0

                    ?

                    "No hay facilitadores registrados para ofrecer este curso"

                    : 

                  course.facilitadores.map((facilitator: any, index: number) => (
                    <li key={index}>{facilitator}</li>
                  ))}
                </ul>
                {editCourse === course._id ? (
                  <button
                    onClick={() => saveEdit(course._id)}
                    className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
                  >
                    Guardar
                  </button>
                ) : (
                  <div className="mt-4 flex space-x-2">
                    <button
                      onClick={() => startEdit(course)}
                      className="px-4 py-2 bg-blue-500 text-white rounded"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => openDeleteModal(course)}
                      className="px-4 py-2 bg-red text-white rounded"
                    >
                      Eliminar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        <div className="mt-6">
          <h3 className="text-lg font-medium">Agregar nuevo curso</h3>
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
            Agregar curso
          </button>
        </div>
      </div>

      {deleteCourse && (
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
                onClick={handleDelete}
                className="px-4 py-2 bg-red text-white rounded"
              >
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableOne;

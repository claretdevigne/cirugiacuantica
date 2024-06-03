import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyStudents, updateMyStudents } from '@/app/lib/dbActions';
import { userStore } from '@/reducers/store';

type Student = {
  _id: string,
  facilitador: string | null,
  nombre: string,
  email: string,
  telefono: number | null,
  pais: string,
  cursos: Record<string, {
    modalidad: string,
    estatus: string,
  }>,
  admin: boolean,
  password: string
}

const fetchStudents = async () => {
  const { user } = userStore.getState()
  const response = await getMyStudents(user.name);
  return JSON.parse(response);
};

const formatCourseName = (courseName: string) => {
  return courseName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const TableListaEstudiantes = () => {
  const { isLoading, data: students, refetch } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [editMode, setEditMode] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'nombre' | 'pais'>('nombre');
  const [searchTerm, setSearchTerm] = useState('');
  const [editableStudent, setEditableStudent] = useState<Student | null>(null);

  const entitleFormat = (text: string) => {
    let formatted = text[0].toLocaleUpperCase() + text.slice(1);
    return formatted;
  }

  const toggleDetails = (studentId: string) => {
    setExpandedStudent(expandedStudent === studentId ? null : studentId);
  };

  const handleSort = (field: 'nombre' | 'pais') => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('asc');
    }
  };

  const handleEdit = (student: Student) => {
    setEditMode(student._id);
    setEditableStudent(student);
  };

  const handleCancel = () => {
    setEditMode(null);
    setEditableStudent(null);
  };

  const handleSave = async () => {
    if (editableStudent) {
      await updateMyStudents(editableStudent);
      setEditMode(null);
      setEditableStudent(null);
      refetch();
    }
  };

  const handleChange = (field: keyof Student, value: any) => {
    if (editableStudent) {
      setEditableStudent((prevState: any) => ({
        ...prevState,
        [field]: value
      }));
    }
  };

  const handleChangeFacilitador = (value: any) => {
    if (editableStudent) {
      setEditableStudent((prevState: any) => ({
        ...prevState,
        facilitador: value
      }));
    }
  };

  const handleChangeStatus = (name: string, value: any) => {
    if (editableStudent) {
      setEditableStudent((prevState: any) => ({
        ...prevState,
        cursos: {
          ...prevState.cursos,
          [name]: {
            ...prevState.cursos[name],
            estatus: value
          }
        }
      }))
    }
  }

  const handleCourseModalidadChange = (courseName: string, value: any) => {
    if (editableStudent) {
      setEditableStudent((prevState: any) => ({
        ...prevState,
        cursos: {
          ...prevState.cursos,
          [courseName]: {
            ...prevState.cursos[courseName],
              modalidad: value
          }
        }
      }));
    }
  };

  const filteredStudents = students?.filter((student: Student) =>
    student.nombre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedStudents = filteredStudents?.sort((a: Student, b: Student) => {
    const fieldA = (a[sortField] ?? '').toLowerCase();
    const fieldB = (b[sortField] ?? '').toLowerCase();

    if (fieldA < fieldB) return sortOrder === 'asc' ? -1 : 1;
    if (fieldA > fieldB) return sortOrder === 'asc' ? 1 : -1;
    return 0;
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

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
          <div className="p-2.5 xl:p-5 cursor-pointer" onClick={() => handleSort('nombre')}>
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Nombre {sortField === 'nombre' && (sortOrder === 'asc' ? '▲' : '▼')}
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Email
            </h5>
          </div>
          <div className="p-2.5 xl:p-5 cursor-pointer" onClick={() => handleSort('pais')}>
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              País {sortField === 'pais' && (sortOrder === 'asc' ? '▲' : '▼')}
            </h5>
          </div>
          <div className="p-2.5 xl:p-5">
            <h5 className="text-sm font-medium uppercase xsm:text-base">
              Ver detalles
            </h5>
          </div>
        </div>

        {
          !sortedStudents.length
          
          ? 
          
          <div className='my-3'>No tiene estudiantes por el momento</div>
          
          :

        sortedStudents?.map((student: Student) => (
          <div key={student._id}>
            <div className={`grid grid-cols-4 border-b border-stroke dark:border-strokedark`}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                {editMode === student._id ? (
                  <input
                    type="text"
                    value={editableStudent?.nombre ?? ''}
                    onChange={(e) => handleChange('nombre', e.target.value)}
                    className="px-2 py-1 border rounded-md"
                  />
                ) : (
                  <p className="text-black dark:text-white">{student.nombre}</p>
                )}
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5 overflow-hidden text-ellipsis">
                {editMode === student._id ? (
                  <input
                    type="text"
                    value={editableStudent?.email ?? ''}
                    onChange={(e) => handleChange('email', e.target.value)}
                    className="px-2 py-1 border rounded-md"
                  />
                ) : (
                  <p className="text-black dark:text-white">{student.email}</p>
                )}
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                {editMode === student._id ? (
                  <input
                    type="text"
                    value={editableStudent?.pais ?? ''}
                    onChange={(e) => handleChange('pais', e.target.value)}
                    className="px-2 py-1 border rounded-md"
                  />
                ) : (
                  <p className="text-black dark:text-white">{student.pais}</p>
                )}
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <button onClick={() => toggleDetails(student._id)} className="text-blue-500 hover:underline">
                  {expandedStudent === student._id ? "Ocultar detalles" : "Ver detalles"}
                </button>
              </div>
            </div>

            {expandedStudent === student._id && (
              <div className="col-span-4 bg-gray-100 p-4 dark:bg-gray-800">
                <h5 className="text-sm font-medium">Cursos:</h5>
                <div className="grid grid-cols-3 gap-4">
                  <div><strong>Curso</strong></div>
                  <div><strong>Estatus</strong></div>
                  <div><strong>Modalidad</strong></div>
                </div>
                <>
                  {Object.entries(student.cursos).map(([courseName, courseDetails]) => {
                    if (courseDetails.estatus === "inactivo") return null;
                    const estatus = entitleFormat(courseDetails.estatus)
                    const modalidad = courseDetails.modalidad === "ninguna" ? "Modalidad no establecida" : entitleFormat(courseDetails.modalidad)

                    return (
                      <div key={courseName}>
                        {editMode === student._id ? (
                          <div className='grid grid-cols-3 gap-4'>
                            <div>{formatCourseName(courseName)}</div>
                            <select
                              value={editableStudent?.cursos[courseName].estatus}
                              onChange={(e) => handleChangeStatus(courseName, e.target.value)}
                              className="border rounded p-2"
                            >
                              <option value={'certificado'}>Certificado</option>
                              <option value={'activo'}>Activo</option>
                              <option value={'inactivo'}>Inactivo</option>
                            </select>
                            
                            <select
                              value={editableStudent?.cursos[courseName].modalidad}
                              onChange={(e) => handleCourseModalidadChange(courseName, e.target.value)}
                              className="border rounded p-2"
                            >
                              <option value={'online'}>Online</option>
                              <option value={'presencial'}>Presencial</option>
                              <option value={'hibrida'}>Híbrida</option>
                            </select>
                          </div>
                        ) : (
                          <div className='grid grid-cols-3 gap-4'>
                            <div>{formatCourseName(courseName)}</div>
                            <div>{estatus}</div>
                            <div>{modalidad}</div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </>

                <h5 className="text-sm font-medium mt-4">Teléfono:</h5>
                <p>{student.telefono ? student.telefono : "No hay número de teléfono registrado"}</p>

                
                  <h5 className="text-sm font-medium mt-4">Facilitador:</h5>
                {
                  editMode === student._id 
                  
                  ?
          
                  <input
                    type="text"
                    value={editableStudent?.facilitador === null ? "" : student.facilitador}
                    onChange={(e) => handleChangeFacilitador(e.target.value)}
                    className="px-2 py-1 border rounded-md"
                    placeholder={student.facilitador === null ? "" : student.facilitador}
                  />
                
                  :
                  
                  <p>{student.facilitador ? student.facilitador : "No hay un facilitador registrado"}</p>
                }
                
              

              
                {
                  editMode !== student._id ?
                  <button onClick={() => handleEdit(student)} className='text-white bg-green-500 hover:bg-green-600 mr-2 px-3 py-2 rounded-md mt-4 self-center'>Editar</button>
                  : ""
                }
                {editMode === student._id && (
                  <div className="flex justify-center mt-4">
                    <button onClick={handleSave} className="text-white bg-green-500 hover:bg-green-600 mr-2 px-3 py-2 rounded-md">
                      Guardar
                    </button>
                    <button onClick={handleCancel} className="text-white bg-slate-500 hover:bg-slate-600 mr-2 px-3 py-2 rounded-md">
                      Cancelar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableListaEstudiantes;

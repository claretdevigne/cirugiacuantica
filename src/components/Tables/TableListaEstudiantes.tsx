import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudents } from '@/app/lib/dbActions';

type Student = {
  _id: string,
  facilitador: string | null,
  nombre: string,
  email: string,
  telefono: number | null,
  pais: string,
  cursos: Record<string, {
    modalidad: {
      online: boolean,
      presencial: boolean
    },
    activo: boolean,
    certificado: boolean
  }>,
  admin: boolean,
  password: string
}

const fetchStudents = async () => {
  const response = await getStudents();
  return JSON.parse(response);
};

const formatCourseName = (courseName: string) => {
  return courseName.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const TableListaEstudiantes = () => {
  const { isLoading, data: students } = useQuery({ queryKey: ["students"], queryFn: fetchStudents });
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [sortField, setSortField] = useState<'nombre' | 'pais'>('nombre');
  const [searchTerm, setSearchTerm] = useState('');

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

        {sortedStudents?.map((student: Student) => (
          <div key={student._id}>
            <div className={`grid grid-cols-4 border-b border-stroke dark:border-strokedark`}>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{student.nombre}</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5 overflow-hidden text-ellipsis">
                <p className="text-black dark:text-white">{student.email}</p>
              </div>
              <div className="flex items-center gap-3 p-2.5 xl:p-5">
                <p className="text-black dark:text-white">{student.pais}</p>
              </div>
              <div className="flex items-center justify-center p-2.5 xl:p-5">
                <button
                  onClick={() => toggleDetails(student._id)}
                  className="text-blue-500 hover:underline"
                >
                  {expandedStudent === student._id ? "Ocultar detalles" : "Ver detalles"}
                </button>
              </div>
            </div>

            {expandedStudent === student._id && (
              <div className="bg-gray-100 p-4 dark:bg-gray-800">
                <h5 className="text-sm font-medium">Cursos:</h5>
                <div className="grid grid-cols-4 gap-4">
                  <div>Curso</div>
                  <div>Estatus</div>
                  <div>Modalidad</div>
                  <div>Facilitador</div>
                  {Object.entries(student.cursos).map(([courseName, courseDetails]) => {
                    if (!courseDetails.activo && !courseDetails.certificado) return null;
                    const estatus = courseDetails.certificado ? "Certificado" : "Cursando";
                    const modalidad = courseDetails.modalidad.online && courseDetails.modalidad.presencial
                      ? "Híbrida"
                      : courseDetails.modalidad.online
                        ? "Online"
                        : "Presencial";

                    return (
                      <React.Fragment key={courseName}>
                        <div>{formatCourseName(courseName)}</div>
                        <div>{estatus}</div>
                        <div>{modalidad}</div>
                        <div>{student.facilitador ? student.facilitador : "No hay ningún facilitador registrado"}</div>
                      </React.Fragment>
                    );
                  })}
                </div>
                <h5 className="text-sm font-medium mt-4">Teléfono:</h5>
                <p>{student.telefono ? student.telefono : "No hay número de teléfono registrado"}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableListaEstudiantes;

import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Proyecto {
    _id: string;
    nombre: string;
    link: string;
    idPersona: string;
    branch: string; // Añadido el campo branch
}

interface ProyectoListProps {
    idpersona: string; // Añade esta prop para que el componente pueda recibir idpersona
}

const ProyectoList: React.FC<ProyectoListProps> = ({ idpersona }) => {
    const [proyectos, setProyectos] = useState<Proyecto[]>([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [projectToDelete, setProjectToDelete] = useState<string | null>(null);

    useEffect(() => {
        const fetchProyectos = async () => {
            try {
                const response = await api.get(`/proyectos/persona/${idpersona}`);
                setProyectos(response.data);
            } catch (error) {
                console.error('Error al obtener proyectos:', error);
            }
        };

        fetchProyectos();
    }, [idpersona]);

    const handleDelete = async () => {
        if (projectToDelete) {
            try {
                await api.delete(`/proyectos/${projectToDelete}`);
                setProyectos(proyectos.filter(p => p._id !== projectToDelete));
                setIsModalOpen(false); // Cerrar el modal después de eliminar
                setProjectToDelete(null); // Resetear el ID del proyecto a eliminar
            } catch (error) {
                console.error('Error al eliminar proyecto:', error);
            }
        }
    };

    const openModal = (id: string) => {
        setProjectToDelete(id);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setProjectToDelete(null); // Resetear el ID del proyecto al cerrar
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-950">Proyectos QA</h2>
                    <Link to="/crear_proyecto" className="px-4 py-2 bg-blue-950 text-white rounded">Crear Proyecto</Link>
                </div>
                <div>
                    <div className="flex items-center space-x-4">
                        {/* Indicadores de tipo de prueba */}
                        <div className="flex flex-col space-y-2">
                            <div className="flex items-center space-x-2">
                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Prueba basado en la experiencia</span>
                                </div>

                                <div className="flex items-center space-x-1">
                                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                                    <span className="text-sm text-gray-600">Prueba estática</span>
                                </div>
                            </div>

                            {/* Nota debajo en negrita */}
                            <div className="mt-2">
                                <p className="text-xs font-bold text-gray-700 text-justify">
                                    Nota: Para el análisis de SonarQube y cálculo del grado de mantenibilidad seguir instrucciones.
                                </p>
                            </div>
                        </div>

                    </div>

                    {/* Salto de línea en la parte inferior */}
                    <div className="mb-4"></div>

                </div>


                <ul>
                    {proyectos.map((proyecto) => (
                        <li key={proyecto._id} className="mb-4">
                            <h3 className="text-xl font-semibold text-black">{proyecto.nombre}</h3>
                            <p className='text-black'>
                                Link: <a href={proyecto.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">{proyecto.link}</a>
                            </p>
                            <p className='text-black'>
                                Branch: <span className="text-gray-700">{proyecto.branch}</span> {/* Mostrar branch */}
                            </p>

                            <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4 mt-2">
                                {/* Segundo cuadro - Verificar Mantenibilidad */}
                                <div className="border border-gray-300 rounded-md p-4 w-full md:w-1/2">
                                    <h2 className="text-sm font-semibold text-gray-700 mb-2 text-center">Verificar Mantenibilidad</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        {/* Subcuadro - Mitad Derecha */}
                                        <div className="border border-gray-300 rounded-md p-2 flex flex-col space-y-2 w-full">
                                        <p className="text-sm font-semibold text-gray-700 mb-2 text-center">Verificación automática</p>
                                            <Link to={`/sonarqube/instructions/${proyecto._id}`} className="px-4 py-2 bg-gray-400 text-white rounded text-center text-sm">Seguir instrucciones</Link>
                                            <Link to={`/sonarqube/${proyecto._id}`} className="px-4 py-2 bg-blue-500 text-white rounded text-center text-sm">Análisis SonarQube</Link>
                                        </div>
                                        {/* Subcuadro - Mitad Izquierda */}
                                        <div className="border border-gray-300 rounded-md p-2 flex flex-col space-y-2 w-full">
                                        <p className="text-sm font-semibold text-gray-700 mb-2 text-center">Verificación manual</p>
                                            <Link to={`/pruebas/${proyecto._id}`} className="px-4 py-2 bg-green-500 text-white rounded text-center text-sm">Lista de verificación</Link>
                                        </div>

                                        
                                    </div>
                                </div>

                                {/* Primer cuadro - Gestión del Proyecto */}
                                <div className="border border-gray-300 rounded-md p-4 w-full md:w-1/2">
                                    <h2 className="text-sm font-semibold text-gray-700 mb-2 text-center">Gestión del Proyecto</h2>
                                    <div className="grid grid-cols-2 gap-2">
                                        <Link to={`/editar_proyecto/${proyecto._id}`} className="px-4 py-2 bg-yellow-500 text-white rounded text-center text-sm">Editar</Link>
                                        <button onClick={() => openModal(proyecto._id)} className="px-4 py-2 bg-red-600 text-white rounded text-center text-sm">Eliminar</button>
                                    </div>
                                </div>
                            </div>



                        </li>
                    ))}
                </ul>
                {/* Modal de Confirmación */}
                {isModalOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="bg-white p-6 rounded shadow-lg">
                            <h3 className="text-lg font-semibold">Confirmar Eliminación</h3>
                            <p>¿Estás seguro de que deseas eliminar este proyecto?</p>
                            <div className="flex justify-end mt-4">
                                <button onClick={closeModal} className="px-4 py-2 bg-gray-300 text-black rounded mr-2">Cancelar</button>
                                <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ProyectoList;

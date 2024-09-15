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

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/proyectos/${id}`);
            setProyectos(proyectos.filter(p => p._id !== id));
        } catch (error) {
            console.error('Error al eliminar proyecto:', error);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-950">Proyectos</h2>
                    <Link to="/crear_proyecto" className="px-4 py-2 bg-blue-950 text-white rounded">Crear Proyecto</Link>
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
                            <div className="flex space-x-4 mt-2">
                                <Link to={`/editar_proyecto/${proyecto._id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">Editar</Link>
                                <button onClick={() => handleDelete(proyecto._id)} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                                <Link to={`/pruebas/${proyecto._id}`} className="px-4 py-2 bg-green-500 text-white rounded">Pruebas</Link>
                                <Link to={`/sonarqube/instructions/${proyecto._id}`} className="px-4 py-2 bg-emerald-500 text-white rounded">Instrucciones</Link>
                                <Link to={`/sonarqube/${proyecto._id}`} className="px-4 py-2 bg-blue-500 text-white rounded">Análisis SonarQube</Link>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default ProyectoList;

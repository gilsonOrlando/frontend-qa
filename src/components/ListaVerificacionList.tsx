import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api';

interface Pauta {
    _id: string;
    pregunta: string;
}

interface ListaVerificacion {
    _id: string;
    nombre: string;
    pautas: Pauta[];
}

const ListaVerificacionList: React.FC = () => {
    const [listas, setListas] = useState<ListaVerificacion[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    useEffect(() => {
        const fetchListas = async () => {
            try {
                const response = await api.get('/listasVerificacion');
                setListas(response.data);
            } catch (error) {
                console.error('Error al obtener listas de verificación:', error);
            }
        };

        fetchListas();
    }, []);

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/listasVerificacion/${id}`);
            setListas(listas.filter(lista => lista._id !== id));
        } catch (error) {
            console.error('Error al eliminar lista de verificación:', error);
        }
    };

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = listas.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-4xl bg-white p-6 shadow-md rounded-lg mt-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-blue-950">Listas de Verificación</h2>
                    <Link to="/crear_listaVerificacion" className="px-4 py-2 bg-blue-950 text-white rounded">Crear Lista</Link>
                </div>
                <ul>
                    {currentItems.map((lista) => (
                        <li key={lista._id} className="mb-4">
                            <h3 className="text-xl font-semibold text-black">{lista.nombre}</h3>
                            <p className='text-black'>{`Pautas: ${lista.pautas.map(p => p.pregunta).join(', ')}`}</p>
                            <div className="flex space-x-4 mt-2">
                                <Link to={`/editar_listaVerificacion/${lista._id}`} className="px-4 py-2 bg-yellow-500 text-white rounded">Editar</Link>
                                <button onClick={() => handleDelete(lista._id)} className="px-4 py-2 bg-red-600 text-white rounded">Eliminar</button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="flex justify-center mt-6">
                    {Array(Math.ceil(listas.length / itemsPerPage)).fill(null).map((_, index) => (
                        <button key={index} onClick={() => paginate(index + 1)} className={`mx-1 px-3 py-1 rounded ${currentPage === index + 1 ? 'bg-blue-950 text-white' : 'bg-gray-300 text-black'}`}>
                            {index + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ListaVerificacionList;

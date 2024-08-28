import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

interface NivelCumplimiento {
    descripcion: string;
    valor: number;
}

interface Pauta {
    _id: string;
    descripcion: string;
    pregunta: string;
    nivelesCumplimiento: NivelCumplimiento[];
}

const PautaList: React.FC = () => {
    const [pautas, setPautas] = useState<Pauta[]>([]);
    const [currentPage, setCurrentPage] = useState(1);
    const pautasPerPage = 10;
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPautas = async () => {
            try {
                const response = await api.get('/pautas');
                setPautas(response.data);
            } catch (error) {
                console.error('Error al obtener pautas:', error);
            }
        };

        fetchPautas();
    }, []);

    const indexOfLastPauta = currentPage * pautasPerPage;
    const indexOfFirstPauta = indexOfLastPauta - pautasPerPage;
    const currentPautas = pautas.slice(indexOfFirstPauta, indexOfLastPauta);

    const handleEdit = (id: string) => {
        navigate(`/editar_pauta/${id}`);
    };

    const handleDelete = async (id: string) => {
        try {
            await api.delete(`/pautas/${id}`);
            setPautas(pautas.filter(pauta => pauta._id !== id));
        } catch (error) {
            console.error('Error al eliminar pauta:', error);
        }
    };

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100 p-6">
            <div className="w-full max-w-4xl bg-white p-8 shadow-md rounded-lg">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-blue-950">Lista de Pautas</h2>
                    <button
                        onClick={() => navigate('/crear_pauta')}
                        className="px-4 py-2 bg-blue-950 text-white rounded"
                    >
                        Crear Pauta
                    </button>
                </div>
                <ul className="space-y-4">
                    {currentPautas.map((pauta) => (
                        <li key={pauta._id} className="bg-white p-4 shadow-sm rounded border border-gray-200">
                            <h3 className="text-xl font-semibold text-blue-950">{pauta.descripcion}</h3>
                            <p className="text-gray-700">{pauta.pregunta}</p>
                            <ul className="list-disc list-inside ml-4 mb-4">
                                {pauta.nivelesCumplimiento.map((nivel, index) => (
                                    <li key={index} className="text-gray-600">
                                        {nivel.descripcion} Valor: {nivel.valor}
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-4 flex space-x-2">
                                <button
                                    onClick={() => handleEdit(pauta._id)}
                                    className="px-4 py-2 bg-yellow-500 text-white rounded"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(pauta._id)}
                                    className="px-4 py-2 bg-red-600 text-white rounded"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
                <div className="mt-6 flex justify-center space-x-2">
                    {Array.from({ length: Math.ceil(pautas.length / pautasPerPage) }, (_, i) => (
                        <button
                            key={i + 1}
                            onClick={() => paginate(i + 1)}
                            className={`px-3 py-1 border rounded ${currentPage === i + 1 ? 'bg-blue-950 text-white' : 'bg-white text-blue-950'}`}
                        >
                            {i + 1}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default PautaList;

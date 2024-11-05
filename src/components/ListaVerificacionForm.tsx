import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

interface Pauta {
    _id: string;
    descripcion: string;
}

const ListaVerificacionForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nombre, setNombre] = useState('');
    const [pautas, setPautas] = useState<string[]>([]);
    const [allPautas, setAllPautas] = useState<Pauta[]>([]);
    
    const [searchTerm, setSearchTerm] = useState(''); // Estado para manejar el texto de búsqueda
    const [filteredPautas, setFilteredPautas] = useState<Pauta[]>([]); // Estado para las pautas filtradas
    
    const navigate = useNavigate();

    useEffect(() => {
        const fetchPautas = async () => {
            try {
                const response = await api.get('/pautas');
                setAllPautas(response.data);
                setFilteredPautas(response.data); // Inicialmente, todas las pautas están disponibles
            } catch (error) {
                console.error('Error al obtener pautas:', error);
            }
        };

        const fetchLista = async () => {
            if (id) {
                try {
                    const response = await api.get(`/listasVerificacion/${id}`);
                    const lista = response.data;
                    setNombre(lista.nombre);
                    setPautas(lista.pautas.map((p: Pauta) => p._id));
                } catch (error) {
                    console.error('Error al obtener lista de verificación:', error);
                }
            }
        };

        fetchPautas();
        fetchLista();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (pautas.length === 0) {
            alert('Por favor, selecciona al menos una pauta.');
            return; // Detiene la ejecución si no hay pautas seleccionadas
        }

        const data = { nombre, pautas };
        try {
            if (id) {
                await api.put(`/listasVerificacion/${id}`, data);
                alert('Lista de verificación actualizada exitosamente');
            } else {
                await api.post('/listasVerificacion', data);
                alert('Lista de verificación creada exitosamente');
            }
            navigate('/lista_verificacion');
        } catch (error) {
            console.error('Error al guardar lista de verificación:', error);
            alert('Error al guardar lista de verificación');
        }
    };

    const handleCancel = () => {
        setNombre('');
        setPautas([]);
        navigate('/lista_verificacion');
    };

    const handlePautaChange = (pautaId: string) => {
        setPautas((prevPautas) =>
            prevPautas.includes(pautaId)
                ? prevPautas.filter((id) => id !== pautaId)
                : [...prevPautas, pautaId]
        );
    };
    const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchTerm(value); // Actualiza el término de búsqueda

        // Filtrar las pautas basadas en el término de búsqueda
        const filtered = allPautas.filter(pauta =>
            pauta.descripcion.toLowerCase().includes(value.toLowerCase())
        );
        setFilteredPautas(filtered);
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-2xl w-full bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-blue-950 mb-6">
                    {id ? 'Editar Lista de Verificación' : 'Crear Lista de Verificación'}
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-blue-950 font-semibold mb-2">Nombre</label>
                        <input
                            required
                            type="text"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-blue-950 font-semibold mb-2">Seleccionar pautas</label>
                        <div className="mt-4 flex items-center">
                            <input
                                type="text"
                                placeholder="Buscar pautas..."
                                value={searchTerm}
                                onChange={handleSearch}// Actualiza el estado del término de búsqueda
                                className="border border-gray-300 rounded p-2 flex-grow mr-2" // flex-grow permite que el input ocupe el espacio disponible
                            />
                        </div>
                        <div><label className="block text-blue-950 font-semibold my-6">Lista pautas</label>
                        </div>
                        {filteredPautas.map((pauta) => (
                            <div key={pauta._id} className="flex items-center mb-2">
                                <input
                                    type="checkbox"
                                    id={`pauta-${pauta._id}`}
                                    checked={pautas.includes(pauta._id)}
                                    onChange={() => handlePautaChange(pauta._id)}
                                    className="mr-2"
                                />
                                <label htmlFor={`pauta-${pauta._id}`} className="text-black text-justify">
                                    {pauta.descripcion}
                                </label>
                            </div>
                        ))}
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-950 text-white rounded"
                        >
                            {id ? 'Actualizar Lista' : 'Crear Lista'}
                        </button>
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="px-4 py-2 bg-gray-400 text-white rounded"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ListaVerificacionForm;

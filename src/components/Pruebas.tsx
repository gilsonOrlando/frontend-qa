import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Importa useParams y useNavigate
import api from '../api';

interface Subcaracteristica {
    _id: string;
    nombre: string;
}

interface Metrica {
    _id: string;
    nombre: string;
}

const Pruebas: React.FC = () => {
    const [subcaracteristicas, setSubcaracteristicas] = useState<Subcaracteristica[]>([]);
    const [metricas, setMetricas] = useState<Metrica[]>([]);
    const [selectedOption, setSelectedOption] = useState<string>('');
    const [selectedSubcaracteristica, setSelectedSubcaracteristica] = useState<string>('');
    const [selectedMetrica, setSelectedMetrica] = useState<string>('');
    const navigate = useNavigate(); // Hook de navegación
    const { id } = useParams(); // Hook para obtener parámetros de la URL

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [subcaracteristicasResponse, metricasResponse] = await Promise.all([
                    api.get('/subcaracteristicas'),
                    api.get('/metricas')
                ]);
                setSubcaracteristicas(subcaracteristicasResponse.data);
                setMetricas(metricasResponse.data);
            } catch (error) {
                console.error('Error al obtener datos:', error);
            }
        };

        fetchData();
    }, []);

    const handleOptionChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSelectedOption(e.target.value);
        setSelectedSubcaracteristica('');
        setSelectedMetrica('');
    };

    const handleSubmit = () => {
        switch (selectedOption) {
            case 'allSubcaracteristicas':
                console.log('Realizar pruebas en todas las subcaracterísticas');
                navigate(`/subcategoriesresponses/${id}`)
                break;
            case 'singleSubcaracteristica':
                console.log('Realizar pruebas en la subcaracterística:', selectedSubcaracteristica);
                if (selectedSubcaracteristica) {
                    navigate(`/subcategoriesresponses/${selectedSubcaracteristica}`);
                }
                break;
            case 'allMetricas':
                console.log('Realizar pruebas en todas las métricas');
                // Aquí podrías redirigir si lo deseas
                break;
            case 'singleMetrica':
                console.log('Realizar pruebas en la métrica:', selectedMetrica);
                if (selectedMetrica) {
                    navigate(`/subcategoriesresponses/${selectedMetrica}`);
                }
                break;
            default:
                console.log('Seleccione una opción válida');
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center bg-gray-100">
            <div className="w-full max-w-2xl bg-white p-6 shadow-md rounded-lg mt-6">
                <h2 className="text-2xl font-bold text-blue-950 mb-4">Seleccione el nivel para realizar sus pruebas</h2>
                <div className="mb-4">
                    <label className="block text-blue-950 font-semibold mb-2">Nivel de Pruebas</label>
                    <select
                        value={selectedOption}
                        onChange={handleOptionChange}
                        className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                    >
                        <option value="">Seleccione una opción</option>
                        <option value="allSubcaracteristicas">A través de todas las subcaracterísticas</option>
                        <option value="singleSubcaracteristica">Escoger una subcaracterística</option>
                        <option value="allMetricas">A través de todas las métricas</option>
                        <option value="singleMetrica">Escoger una métrica</option>
                    </select>
                </div>
                {selectedOption === 'singleSubcaracteristica' && (
                    <div className="mb-4">
                        <label className="block text-blue-950 font-semibold mb-2">Subcaracterística</label>
                        <select
                            value={selectedSubcaracteristica}
                            onChange={(e) => setSelectedSubcaracteristica(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                        >
                            <option value="">Seleccione una subcaracterística</option>
                            {subcaracteristicas.map((subcaracteristica) => (
                                <option key={subcaracteristica._id} value={subcaracteristica._id}>
                                    {subcaracteristica.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                {selectedOption === 'singleMetrica' && (
                    <div className="mb-4">
                        <label className="block text-blue-950 font-semibold mb-2">Métrica</label>
                        <select
                            value={selectedMetrica}
                            onChange={(e) => setSelectedMetrica(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                        >
                            <option value="">Seleccione una métrica</option>
                            {metricas.map((metrica) => (
                                <option key={metrica._id} value={metrica._id}>
                                    {metrica.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                )}
                <button
                    onClick={handleSubmit}
                    className="px-4 py-2 bg-blue-950 text-white rounded"
                >
                    Realizar Pruebas
                </button>
            </div>
        </div>
    );
};

export default Pruebas;

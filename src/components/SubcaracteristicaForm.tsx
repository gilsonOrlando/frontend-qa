import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

interface Metrica {
    _id: string;
    nombre: string;
}

const SubcaracteristicaForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nombre, setNombre] = useState('');
    const [metricas, setMetricas] = useState<Metrica[]>([]);
    const [selectedMetricas, setSelectedMetricas] = useState<string[]>([]);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMetricas = async () => {
            try {
                const response = await api.get('/metricas');
                setMetricas(response.data);
            } catch (error) {
                console.error('Error al obtener métricas:', error);
            }
        };

        const fetchSubcaracteristica = async () => {
            if (id) {
                try {
                    const response = await api.get(`/subcaracteristicas/${id}`);
                    const subcaracteristica = response.data;
                    setNombre(subcaracteristica.nombre);
                    // Asegúrate de que 'subcaracteristica.metricas' contiene IDs de métricas
                    setSelectedMetricas(subcaracteristica.metricas.map((metrica: Metrica) => metrica._id));
                } catch (error) {
                    console.error('Error al obtener subcaracterística:', error);
                }
            }
        };

        fetchMetricas();
        fetchSubcaracteristica();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (selectedMetricas.length === 0) {
            alert('Por favor, selecciona al menos una metrica.');
            return; // Detiene la ejecución si no hay pautas seleccionadas
        }
        const data = { nombre, metricas: selectedMetricas };
        try {
            if (id) {
                await api.put(`/subcaracteristicas/${id}`, data);
                alert('Subcaracterística actualizada exitosamente');
            } else {
                await api.post('/subcaracteristicas', data);
                alert('Subcaracterística creada exitosamente');
            }
            navigate('/lista_subcaracteristicas');
        } catch (error) {
            console.error('Error al guardar subcaracterística:', error);
            alert('Error al guardar subcaracterística');
        }
    };

    const handleCancel = () => {
        setNombre('');
        setSelectedMetricas([]);
        navigate('/lista_subcaracteristicas');
    };

    const handleCheckboxChange = (id: string) => {
        setSelectedMetricas(prev =>
            prev.includes(id) ? prev.filter(m => m !== id) : [...prev, id]
        );
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-2xl w-full bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-blue-950 mb-6">
                    {id ? 'Editar Subcaracterística' : 'Crear Subcaracterística'}
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
                        <label className="block text-blue-950 font-semibold mb-2">Métricas</label>
                        <div className="space-y-2">
                            {metricas.map((metrica) => (
                                <div key={metrica._id} className="flex items-center">
                                    <input
                                        type="checkbox"
                                        id={metrica._id}
                                        checked={selectedMetricas.includes(metrica._id)}
                                        onChange={() => handleCheckboxChange(metrica._id)}
                                        className="mr-2"
                                    />
                                    <label htmlFor={metrica._id} className="text-black">{metrica.nombre}</label>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-950 text-white rounded"
                        >
                            {id ? 'Actualizar Subcaracterística' : 'Crear Subcaracterística'}
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

export default SubcaracteristicaForm;

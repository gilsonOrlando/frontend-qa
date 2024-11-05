import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

interface ListaVerificacion {
    _id: string;
    nombre: string;
}

const MetricaForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [nombre, setNombre] = useState('');
    const [listaVerificaciones, setListaVerificaciones] = useState<ListaVerificacion[]>([]);
    const [listaVerificacion, setListaVerificacion] = useState<string>(''); // ID de la lista de verificación seleccionada
    const navigate = useNavigate();

    useEffect(() => {
        const fetchListaVerificaciones = async () => {
            try {
                const response = await api.get('/listasVerificacion');
                setListaVerificaciones(response.data);
            } catch (error) {
                console.error('Error al obtener listas de verificación:', error);
            }
        };

        const fetchMetrica = async () => {
            if (id) {
                try {
                    const response = await api.get(`/metricas/${id}`);
                    const metrica = response.data;
                    setNombre(metrica.nombre);
                    setListaVerificacion(metrica.listaVerificacion._id); // Asegúrate de que esto sea el ID de la lista de verificación
                } catch (error) {
                    console.error('Error al obtener métrica:', error);
                }
            }
        };

        fetchListaVerificaciones();
        fetchMetrica();
    }, [id]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (listaVerificacion.length === 0) {
            alert('Por favor, selecciona al menos una lista de verificación.');
            return; // Detiene la ejecución si no hay pautas seleccionadas
        }
        const data = { nombre, listaVerificacion };
        try {
            if (id) {
                await api.put(`/metricas/${id}`, data);
                alert('Métrica actualizada exitosamente');
            } else {
                await api.post('/metricas', data);
                alert('Métrica creada exitosamente');
            }
            navigate('/lista_metrica');
        } catch (error) {
            console.error('Error al guardar métrica:', error);
            alert('Error al guardar métrica');
        }
    };

    const handleCancel = () => {
        setNombre('');
        setListaVerificacion('');
        navigate('/lista_metrica');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-2xl w-full bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-blue-950 mb-6">
                    {id ? 'Editar Métrica' : 'Crear Métrica'}
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
                        <label className="block text-blue-950 font-semibold mb-2">Lista de Verificación</label>
                        <select
                            value={listaVerificacion}
                            onChange={(e) => setListaVerificacion(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                        >
                            <option value="">Seleccione una lista de verificación</option>
                            {listaVerificaciones.map((lista) => (
                                <option key={lista._id} value={lista._id}>{lista.nombre}</option>
                            ))}
                        </select>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-950 text-white rounded"
                        >
                            {id ? 'Actualizar Métrica' : 'Crear Métrica'}
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

export default MetricaForm;

import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../api';

const PautaForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const [descripcion, setDescripcion] = useState('');
    const [pregunta, setPregunta] = useState('');
    const [nivelesCumplimiento, setNivelesCumplimiento] = useState([{ descripcion: '', valor: 0 }]);
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            const fetchPauta = async () => {
                try {
                    const response = await api.get(`/pautas/${id}`);
                    const pauta = response.data;
                    setDescripcion(pauta.descripcion);
                    setPregunta(pauta.pregunta);
                    setNivelesCumplimiento(pauta.nivelesCumplimiento);
                } catch (error) {
                    console.error('Error al obtener pauta:', error);
                }
            };
            fetchPauta();
        }
    }, [id]);

    const handleNivelesChange = (index: number, field: string, value: string | number) => {
        const updatedNiveles = [...nivelesCumplimiento];
        updatedNiveles[index] = { ...updatedNiveles[index], [field]: value };
        setNivelesCumplimiento(updatedNiveles);
    };

    const addNivel = () => {
        setNivelesCumplimiento([...nivelesCumplimiento, { descripcion: '', valor: 0 }]);
    };

    const removeNivel = (index: number) => {
        const updatedNiveles = nivelesCumplimiento.filter((_, i) => i !== index);
        setNivelesCumplimiento(updatedNiveles);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (id) {
                await api.put(`/pautas/${id}`, { descripcion, pregunta, nivelesCumplimiento });
                alert('Pauta actualizada exitosamente');
            } else {
                await api.post('/pautas', { descripcion, pregunta, nivelesCumplimiento });
                alert('Pauta creada exitosamente');
            }
            navigate('/lista_pauta');
        } catch (error) {
            console.error('Error al guardar pauta:', error);
            alert('Error al guardar pauta');
        }
    };

    const handleCancel = () => {
        setDescripcion('');
        setPregunta('');
        setNivelesCumplimiento([{ descripcion: '', valor: 0 }]);
        navigate('/lista_pauta');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="max-w-2xl w-full bg-white p-8 shadow-md rounded-lg">
                <h1 className="text-2xl font-bold text-blue-950 mb-6">
                    {id ? 'Editar Pauta' : 'Crear Pauta'}
                </h1>
                <form onSubmit={handleSubmit}>
                    <div className="mb-4">
                        <label className="block text-blue-950 font-semibold mb-2">Descripción</label>
                        <input
                            required
                            type="text"
                            value={descripcion}
                            onChange={(e) => setDescripcion(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-blue-950 font-semibold mb-2">Pregunta</label>
                        <input
                            required
                            type="text"
                            value={pregunta}
                            onChange={(e) => setPregunta(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-blue-950 font-semibold mb-2">Niveles de Cumplimiento</label>
                        {nivelesCumplimiento.map((nivel, index) => (
                            <div key={index} className="flex space-x-4 mb-2 items-center">
                                <input
                                    required
                                    type="text"
                                    placeholder="Descripción"
                                    value={nivel.descripcion}
                                    onChange={(e) =>
                                        handleNivelesChange(index, 'descripcion', e.target.value)
                                    }
                                    className="w-full p-2 border border-gray-300 rounded bg-white text-black"
                                />
                                <input
                                    type="number"
                                    placeholder="Valor"
                                    value={nivel.valor}
                                    onChange={(e) =>
                                        handleNivelesChange(index, 'valor', Number(e.target.value))
                                    }
                                    className="w-24 p-2 border border-gray-300 rounded bg-white text-black"
                                />
                                {nivelesCumplimiento.length > 4 && (
                                    <button
                                        type="button"
                                        onClick={() => removeNivel(index)}
                                        className="px-2 py-1 bg-red-600 text-white rounded"
                                    >
                                        Cancelar
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addNivel}
                            className="mt-2 px-4 py-2 bg-blue-950 text-white rounded"
                            disabled={nivelesCumplimiento.length >= 5}
                        >
                            Agregar Nivel
                        </button>
                    </div>
                    <div className="flex justify-between">
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-950 text-white rounded"
                        >
                            {id ? 'Actualizar Pauta' : 'Crear Pauta'}
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

export default PautaForm;

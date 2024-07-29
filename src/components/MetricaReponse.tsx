import React, { useEffect, useState } from 'react';
import api from '../api';
import { useParams, useNavigate } from 'react-router-dom';

// Define las interfaces para los datos
interface Pauta {
  _id: string;
  descripcion: string;
  pregunta: string;
  nivelesCumplimiento: {
    descripcion: string;
    valor: number;
  }[];
}

interface ListaVerificacion {
  _id: string;
  nombre: string;
  pautas: Pauta[];
}

interface Metrica {
  _id: string;
  nombre: string;
  listaVerificacion: ListaVerificacion;
}

const MetricaResponse: React.FC = () => {
  const [metrica, setMetrica] = useState<Metrica | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [respuestas, setRespuestas] = useState<{ [key: string]: number | null }>({});
  const [nombreRespuesta, setNombreRespuesta] = useState<string>(''); // Nuevo estado para el nombre de la respuesta
  const navigate = useNavigate(); // Hook de navegación
  const { id: metricaId, id2: proyectoId } = useParams<{ id: string, id2: string }>(); // Hook para obtener parámetros de la URL

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api.get<Metrica>(`/metricas/one/${metricaId}`);
        console.log('Datos recibidos:', response.data);
        setMetrica(response.data);
      } catch (err) {
        console.error('Error al obtener los datos:', err);
        setError('Error al obtener los datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [metricaId]);

  const handleSelectChange = (pautaId: string, listaVerificacionId: string, valor: number) => {
    setRespuestas(prevRespuestas => ({
      ...prevRespuestas,
      [`${pautaId}-${listaVerificacionId}`]: prevRespuestas[`${pautaId}-${listaVerificacionId}`] === valor ? null : valor,
    }));
  };

  const handleSubmit = async () => {
    const formattedRespuestas = Object.keys(respuestas).map(key => {
      const [pautaId, listaVerificacionId] = key.split('-');
      return {
        pautaId,
        listaVerificacion: listaVerificacionId,
        valor: respuestas[key],
      };
    });

    const data = {
      proyectoId,
      tipo: 'singleMetrica',
      metricaId,
      respuestas: formattedRespuestas,
      nombre: nombreRespuesta // Enviar el nombre de la respuesta
    };

    try {
      await api.post('/respuestas/guardar-respuestas', data);
      alert('Respuestas guardadas exitosamente');
      navigate(`/pruebas/${proyectoId}`);
    } catch (error) {
      console.error('Error al guardar las respuestas:', error);
      alert('Hubo un error al guardar las respuestas');
    }
  };

  if (loading) return <p className="text-center text-gray-500">Loading...</p>;
  if (error) return <p className="text-center text-red-500">{error}</p>;

  if (!metrica) return <p className="text-center text-gray-500">No se encontró la métrica.</p>;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Cuestionario</h1>
      <div className="mb-4">
        <label className="block text-blue-950 font-semibold mb-2">Nombre de la Respuesta</label>
        <input
          type="text"
          value={nombreRespuesta}
          onChange={(e) => setNombreRespuesta(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded bg-white text-black"
        />
      </div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-2 text-gray-700">{metrica.nombre}</h2>
        <div className="p-4 bg-gray-100 rounded-lg shadow-sm">
          <h3 className="text-md font-medium mb-2 text-gray-500">{metrica.listaVerificacion.nombre}</h3>
          {metrica.listaVerificacion.pautas.length > 0 ? (
            metrica.listaVerificacion.pautas.map((pauta) => (
              <div key={pauta._id} className="mb-4">
                <h4 className="text-md font-normal mb-1 text-gray-600">{pauta.pregunta}</h4>
                <ul className="list-disc pl-5">
                  {pauta.nivelesCumplimiento.length > 0 ? (
                    pauta.nivelesCumplimiento.map((nivel) => (
                      <li key={nivel.descripcion} className="mb-1">
                        <label className="flex items-center text-gray-700">
                          <input
                            type="checkbox"
                            name={`${pauta._id}-${metrica.listaVerificacion._id}`}
                            value={nivel.valor}
                            checked={respuestas[`${pauta._id}-${metrica.listaVerificacion._id}`] === nivel.valor}
                            onChange={() => handleSelectChange(pauta._id, metrica.listaVerificacion._id, nivel.valor)}
                            className="mr-2"
                          />
                          {nivel.descripcion} - Valor: {nivel.valor}
                        </label>
                      </li>
                    ))
                  ) : (
                    <li className="text-gray-500">No hay niveles de cumplimiento</li>
                  )}
                </ul>
              </div>
            ))
          ) : (
            <p className="text-gray-500">No hay pautas</p>
          )}
        </div>
      </div>
      <button
        onClick={handleSubmit}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        Guardar respuestas
      </button>
    </div>
  );
};

export default MetricaResponse;
